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
      body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(response.status).json({ error: data?.error?.message || "Upstream error" });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry I couldn't get that.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Fetch failed:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}