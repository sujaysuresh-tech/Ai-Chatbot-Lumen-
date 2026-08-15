const chatContainer = document.querySelector(".chat-container");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chips = document.querySelectorAll(".chip");

function updateEmptyState() {
    if (chatBox.children.length === 0) {
        chatContainer.classList.add("is-empty");
    } else {
        chatContainer.classList.remove("is-empty");
    }
}

// The full conversation for THIS browser tab/user only. sessionStorage is
// scoped per-tab, so different visitors (or different tabs) never see or
// touch each other's history — there's no server-side storage at all.
let conversation = [];

function loadConversation() {
    try {
        const saved = sessionStorage.getItem("lumenConversation");
        conversation = saved ? JSON.parse(saved) : [];
    } catch (e) {
        conversation = [];
    }
}

function saveConversation() {
    sessionStorage.setItem("lumenConversation", JSON.stringify(conversation));
}

function renderConversation() {
    chatBox.innerHTML = "";
    conversation.forEach(turn => {
        addMessage(turn.text, turn.role === "user" ? "user-message" : "bot-message", turn.role === "model");
    });
}

window.onload = () => {
    loadConversation();
    renderConversation();
    chatBox.scrollTop = chatBox.scrollHeight;
    updateEmptyState();
}

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function markdownToHtml(text) {
    let safe = escapeHtml(text);

    safe = safe.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    safe = safe.replace(/^## (.*)$/gm, "<h2>$1</h2>");
    safe = safe.replace(/^# (.*)$/gm, "<h1>$1</h1>");

    safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    safe = safe.replace(/^(?:\*|-)\s+(.*)$/gm, "<li>$1</li>");

    safe = safe.replace(/(<li>.*<\/li>)(\n<li>.*<\/li>)*/g, (match) => `<ul>${match.replace(/\n/g, "")}</ul>`);

    safe = safe.replace(/\n/g, "<br>");

    return safe;
}

function addMessage(message, classNme, isHtml = false) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", classNme);

    if (isHtml) {
        msgDiv.innerHTML = markdownToHtml(message);
    } else {
        msgDiv.textContent = message;
    }

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    updateEmptyState();
}

function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message");
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span><span></span><span></span>
        </div>
    `;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}

async function getBotReplay(userMessage, history) {
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage, history })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("API Error:", data);
            return data?.error || "Error fetching response";
        }

        return data.reply || "Sorry I couldn't get that.";

    } catch (error) {
        console.error("Fetch failed:", error);
        return "Something went wrong. Please try again.";
    }
}

async function sendMessage(text) {
    const message = text.trim();
    if (message === "") return;
    addMessage(message, "user-message");
    userInput.value = "";
    const typingDiv = showTyping();

    // Send everything said so far in THIS conversation as context.
    const historyForRequest = conversation.map(turn => ({ role: turn.role, text: turn.text }));
    const botReplay = await getBotReplay(message, historyForRequest);
    typingDiv.remove();
    addMessage(botReplay, "bot-message", true);

    // Persist both turns so the next message keeps the thread, and so a
    // page reload restores this tab's conversation (still per-user only).
    conversation.push({ role: "user", text: message });
    conversation.push({ role: "model", text: botReplay });
    saveConversation();
}

sendBtn.onclick = () => sendMessage(userInput.value);

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage(userInput.value);
});

chips.forEach(chip => {
    chip.addEventListener("click", () => {
        sendMessage(chip.dataset.prompt);
    });
});
