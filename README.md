<div align="center">

# ✨ Lumen 🤖

### 💬 Your Conversational AI Assistant

[![Live Demo](https://img.shields.io/badge/🔴_Live_Demo-Visit-6D28D9?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-chatbot-lumen.vercel.app/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20JS-7C3AED?style=flat-square&logo=javascript&logoColor=white)](#)
[![Gemini API](https://img.shields.io/badge/Gemini-2.5%20Flash-8B5CF6?style=flat-square&logo=googlegemini&logoColor=white)](#)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-A78BFA?style=flat-square&logo=vercel&logoColor=white)](#)

[Overview](#-overview) • [Features](#-features) • [Tech Stack](#️-tech-stack) • [Architecture](#-architecture) • [Installation](#-installation) • [Usage](#-usage) • [Roadmap](#-roadmap)

</div>

---

## 🌟 Overview

**Lumen** is a lightweight, framework-free AI chatbot built entirely with vanilla JavaScript. It talks directly to the **Gemini 2.5 Flash API** 🤖 to deliver fast, conversational responses through a clean, dark-mode glassmorphism interface — no React, no Vue, no build-heavy frontend framework required. 🚫📦

The project explores how far a dependency-light frontend can go when paired with a modern LLM API — keeping the UI, styling, and API logic simple, fast, and easy to reason about. ⚡

🔗 **Live demo:** [Live Demo](https://ai-chatbot-lumen.vercel.app/)

---

## 🚀 Features

- 💬 **Conversational AI chat** powered by the Gemini 2.5 Flash API
- 🌑 **Dark mode glassmorphism UI** — clean, modern flat aesthetic with translucent surfaces
- ⚡ **Zero-framework frontend** — built with plain HTML, CSS, and JavaScript for minimal load times
- 🔐 **Server-side API handling** — Gemini requests are routed through a serverless function to keep the API key off the client
- ☁️ **Deployed on Vercel** for fast, global access

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| 🎨 Frontend | HTML, CSS, Vanilla JavaScript |
| 🤖 AI Model | Gemini 2.5 Flash API |
| ⚙️ Backend | Vercel Serverless Function (`/api`) |
| 💅 Styling | Custom CSS — dark mode glassmorphism |
| ☁️ Deployment | Vercel |

---

## 🏗️ Architecture

```
Ai-Chatbot-Lumen-/
├── 📁 api/                 # Vercel serverless function(s) — proxies requests to the Gemini API
├── 📄 index.html            # App shell & chat UI markup
├── 📜 script.js              # Chat logic — handles input, rendering, and API calls
├── 🎨 style.css               # Dark mode glassmorphism styling
├── 🙈 .gitignore
└── 📘 README.md
```

**Flow:** 🧑 user types a message → `script.js` sends it to the `/api` serverless function → the function calls the **Gemini 2.5 Flash API** 🤖 → the response streams back and is rendered in the chat window. Keeping the Gemini API key inside `/api` (rather than in client-side JS) means it's never exposed in the browser. 🔒

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/sujaysuresh-tech/Ai-Chatbot-Lumen-.git
cd Ai-Chatbot-Lumen-
```

Since Lumen uses a Vercel serverless function for the API layer, the easiest way to run it locally is with the Vercel CLI: 🖥️

```bash
npm install -g vercel
vercel dev
```

---

## 🔑 Configuration

Lumen needs a Gemini API key to talk to the model.

Add it as an environment variable (locally in a `.env` file, or in your Vercel project settings for deployment):

```bash
GEMINI_API_KEY=your-api-key-here
```

> ⚠️ Never commit your API key to a public repository — that's exactly why it lives in the serverless function's environment variables instead of client-side code. 🙅‍♂️

---

## 💡 Usage

1. Open the app locally, or try the **[live demo](https://ai-chatbot-lumen.vercel.app/)** 🔴
2. Type a message into the chat input ⌨️
3. Lumen sends it to Gemini 2.5 Flash via the `/api` route and renders the response in the chat window ✨

---

## 🗺️ Roadmap

- [ ] 📡 Streaming responses (token-by-token rendering)
- [ ] 💾 Persistent chat history
- [ ] 🗂️ Multi-conversation / chat session support
- [ ] 📝 Markdown and code-block rendering in responses
- [ ] ☀️ Light mode toggle

---


<div align="center">

Built by [Sujay Suresh](https://github.com/sujaysuresh-tech) · 🔗 [Live Demo](https://ai-chatbot-lumen.vercel.app/) · 📦 [Repository](https://github.com/sujaysuresh-tech/Ai-Chatbot-Lumen-)

</div>
