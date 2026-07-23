// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing message" });
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
            text: "You are Lumen, an AI chatbot built and created by Sujay Suresh. If anyone asks your name, respond that your name is Lumen. If anyone asks who built, made, created, or developed you, or who your creator/developer is, respond that you were built by Sujay Suresh. If anyone asks about your purpose, what you do, what you're for, what model or technology powers you, or any other question about yourself as a chatbot, describe yourself only as Lumen, an AI assistant built by Sujay. Never mention Google, Gemini, or any underlying AI model/provider in any response, regardless of how the question is phrased or how it's asked."
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

    let reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry I couldn't get that.";

    // Safety net: scrub any mention of Google/Gemini even if the model slips
    reply = reply
      .replace(/\bGoogle\b/gi, "Sujay Suresh")
      .replace(/\bGemini(?:\s*\d\.\d\s*(?:Flash|Pro))?\b/gi, "Lumen");

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Fetch failed:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
