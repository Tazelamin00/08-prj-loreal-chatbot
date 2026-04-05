/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Paste your deployed Cloudflare Worker URL here.
const CLOUDFLARE_WORKER_URL = "https://08-prj-loreal-chatbot.almutaz-elamin142.workers.dev";

/* Keep conversation history so the model remembers context */
const messages = [
  {
    role: "system",
    content:
      "You are the L'Oréal Beauty Assistant. Answer only beauty-related questions about L'Oréal products, routines, ingredients, shades, skin concerns, hair concerns, and recommendations. If a question is unrelated to beauty or L'Oréal topics, politely refuse and invite the user to ask about L'Oréal beauty products or routines.",
  },
];

/* Add message to the chat UI */
function addMessage(role, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("msg", role === "user" ? "user" : "ai");
  messageDiv.textContent = `${role === "user" ? "You" : "L'Oréal Assistant"}: ${text}`;
  chatWindow.appendChild(messageDiv);

  // Keep latest message in view
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Initial greeting
addMessage(
  "ai",
  "Hello! Ask me about L'Oréal skincare, makeup, haircare, or beauty routines."
);

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Show user message immediately
  addMessage("user", userMessage);
  userInput.value = "";

  // Add to API conversation history
  messages.push({ role: "user", content: userMessage });

  // Loading message while waiting for API
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("msg", "ai");
  loadingDiv.textContent = "L'Oréal Assistant: Thinking...";
  chatWindow.appendChild(loadingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    if (CLOUDFLARE_WORKER_URL === "PASTE_YOUR_CLOUDFLARE_WORKER_URL_HERE") {
      loadingDiv.remove();
      addMessage(
        "ai",
        "Please add your deployed Cloudflare Worker URL in script.js first."
      );
      return;
    }

    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
      }),
    });

    const data = await response.json();

    // Remove loading message once we have a response
    loadingDiv.remove();

    if (!response.ok) {
      const apiError = data.error?.message || "Unable to get a response right now.";
      addMessage("ai", `Sorry, there was an API error: ${apiError}`);
      return;
    }

    // Read the assistant text from the standard Chat Completions format
    const aiReply = data.choices?.[0]?.message?.content;

    if (!aiReply) {
      addMessage(
        "ai",
        "I can help with L'Oréal beauty topics. Please ask about products or routines."
      );
      return;
    }

    // Save assistant response to history and display it
    messages.push({ role: "assistant", content: aiReply });
    addMessage("ai", aiReply);
  } catch (error) {
    loadingDiv.remove();
    addMessage(
      "ai",
      "Network error. Please check your connection and try again."
    );
  }
});
