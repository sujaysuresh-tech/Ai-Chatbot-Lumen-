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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
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

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: "You are Lumen, an AI chatbot built by Sujay. Answer normally and factually for all topics."
          }]
        },
        contents: [{ parts: [{ text: message }] }]
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
