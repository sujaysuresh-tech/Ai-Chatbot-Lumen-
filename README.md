<div align="center">

# ✨ Lumen

### Your Conversational AI Assistant

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-6D28D9?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-chatbot-lumen.vercel.app/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-7C3AED?style=flat-square&logo=javascript&logoColor=white)](#)
[![Gemini API](https://img.shields.io/badge/Gemini-2.5%20Flash-8B5CF6?style=flat-square&logo=googlegemini&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-A78BFA?style=flat-square)](#license)

[Overview](#overview) • [Features](#features) • [Tech Stack](#tech-stack) • [Architecture](#architecture) • [Installation](#installation) • [Usage](#usage) • [Roadmap](#roadmap)

</div>

---

## Overview

**Lumen** is a lightweight, framework-free AI chatbot built entirely with vanilla JavaScript. It integrates directly with the **Gemini 2.5 Flash API** to deliver fast, conversational responses through a clean, dark-mode glassmorphism interface — no React, no Vue, no build-heavy frontend framework required.

The project explores how far a dependency-light frontend can go when paired with a modern LLM API, using a modular ES module architecture to keep UI rendering, API communication, and conversation state cleanly separated.

**Live demo:** [ai-chatbot-lumen.vercel.app](https://ai-chatbot-lumen.vercel.app/)

---

## Features

- **Conversational AI chat** powered by the Gemini 2.5 Flash API
- **Modular ES module architecture** — separate modules for API handling, UI rendering, and state management
- **Dark mode glassmorphism UI** — clean, modern flat aesthetic with translucent surfaces
- **Zero-framework frontend** — built with plain HTML, CSS, and JavaScript for minimal load times
- **Deployed on Vercel** for fast, global access

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript (ES Modules) |
| AI Model | Gemini 2.5 Flash API |
| Styling | Custom CSS — dark mode glassmorphism |
| Deployment | Vercel |

---

## Architecture

```
lumen/
├── index.html              # App shell / entry point
├── styles/
│   └── main.css              # Glassmorphism dark-mode styling
├── src/
│   ├── main.js                # App entry — wires modules together
│   ├── api/
│   │   └── gemini.js            # Gemini 2.5 Flash API integration
│   ├── ui/
│   │   └── chatRenderer.js      # Renders messages to the DOM
│   └── state/
│       └── conversation.js      # Conversation/history state management
└── README.md
```

The app follows a simple unidirectional flow: user input → conversation state update → Gemini API call → response rendered back into the chat UI. Each concern (API, UI, state) lives in its own module, keeping the codebase easy to extend.

---

## Installation

```bash
# Clone the repository
git clone https://github.com/sujaysuresh-tech/lumen.git
cd lumen
```

Since Lumen is a vanilla JS project with no build step, you can serve it with any static server:

```bash
# Using Python
python -m http.server 5500

# Or using Node's live-server
npx live-server
```

---

## Configuration

Lumen requires a Gemini API key to function.

Add it to your environment/config (e.g. a `.env` file or a config module, depending on how the project is set up):

```js
// src/api/config.js
export const GEMINI_API_KEY = "your-api-key-here";
```

> ⚠️ Never commit your API key to a public repository. Use environment variables or a `.gitignore`-protected config file in production.

---

## Usage

1. Open the app locally, or try the **[live demo](https://ai-chatbot-lumen.vercel.app/)**.
2. Type a message into the chat input.
3. Lumen sends your message to the Gemini 2.5 Flash API and renders the response in the chat window.

---

## Roadmap

- [ ] Streaming responses (token-by-token rendering)
- [ ] Persistent chat history (local storage or backend-backed)
- [ ] Multi-conversation / chat session support
- [ ] Markdown and code-block rendering in responses
- [ ] Light mode toggle

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built by [Sujay Suresh](https://github.com/sujaysuresh-tech) · [Live Demo](https://ai-chatbot-lumen.vercel.app/)

</div>
