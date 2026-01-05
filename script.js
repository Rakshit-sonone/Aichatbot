import { apiKey } from "./config.js";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(message, className) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", className);
    msgDiv.textContent = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message");
    typingDiv.textContent = "AI is typing...";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}

function cleanBotText(text) {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/_/g, "")
    .replace(/\n+/g, "\n")
    .trim();
}


async function getBotReply(userMessage) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: userMessage }]
                }
            ]
        })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

sendBtn.onclick = async () => {
    const message = userInput.value.trim();
    if (message === "") return;

    addMessage(message, "user-message");
    userInput.value = "";

    const typingDiv = showTyping();

    try {
        const botReply = await getBotReply(message);
         typingDiv.remove();
const cleanReply = cleanBotText(botReply);

addMessage(cleanReply, "bot-message");

        
    } catch (error) {
        typingDiv.remove();
        addMessage("Error occurred. Try again.", "bot-message");
    }
};

// Enter key support
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendBtn.click();
});
