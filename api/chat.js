// api/chat.js

// Matches questions about the chatbot's own identity, creator, or underlying tech.
// Intentionally broad — false positives here just mean an identity-style answer
const IDENTITY_PATTERN = /\b(who (made|built|created|developed|coded|designed)|your (name|creator|developer|maker)|what('?s| is) your name|who('?s| is) your (creator|developer|maker)|who('?s| is) (the person|the developer|behind) (this|the app|you)|what (model|ai|tech|technology|engine|api|llm) (are you|do you use|power|powers|run|runs) you|are you (gemini|chatgpt|gpt|google|claude|openai)|what (are you|is lumen)|tell me about (yourself|lumen)|what('?s| is) your purpose|what do you do\b)/i;

function getIdentityReply(message) {
  if (/purpose|what do you do|what('?s| is) lumen|what are you\b/i.test(message)) {
    return "I'm Lumen, an AI assistant built by Sujay, here to help answer your questions.";
  }
  if (/name/i.test(message)) {
    return "My name is Lumen.";
  }
  // covers creator / model / "are you gemini" / "who's behind this" etc.
  return "I'm Lumen, an AI assistant built by Sujay.";
}

// Keep the history each request is allowed to carry bounded, so a single
// runaway client can't blow up token usage or payload size.
const MAX_HISTORY_TURNS = 20; // ~10 user/model exchanges

// IMPORTANT: This function must stay stateless. Never store per-user data
// (conversation history, sessions, etc.) in module-level / global variables
// here — Vercel can reuse the same warm serverless instance to serve
// different users' concurrent requests, and anything kept in module scope
// would leak from one user's chat into another's. All conversation state
// lives on the client (sessionStorage) and is sent in full with every
// request instead.
function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (turn) =>
        turn &&
        (turn.role === "user" || turn.role === "model") &&
        typeof turn.text === "string" &&
        turn.text.trim().length > 0
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text.slice(0, 8000) }], // guard against giant payloads
    }));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing message" });
  }

  // Intercept identity questions before calling Gemini at all —
  // guarantees the answer, and never touches unrelated topics.
  if (IDENTITY_PATTERN.test(message)) {
    return res.status(200).json({ reply: getIdentityReply(message) });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  // This request's own conversation, built fresh from what the client sent
  // us plus the new message. Nothing here is shared across requests.
  const contents = [
    ...sanitizeHistory(history),
    { role: "user", parts: [{ text: message }] },
  ];

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: "You are Lumen, an AI chatbot built by Sujay. Answer normally and factually for all topics. Use the prior conversation turns for context."
          }]
        },
        contents
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      if (response.status === 429) {
        return res.status(429).json({
          error: "Lumen has reached its message limit for the moment. Please check back after a while."
        });
      }

      return res.status(response.status).json({
        error: "Something went wrong on our end. Please try again shortly."
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry I couldn't get that.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Fetch failed:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
