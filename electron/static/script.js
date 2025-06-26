async function sendMessage() {
  const textarea = document.getElementById("user-input");
  const message = textarea.value.trim();
  if (!message) return;

  // Hide welcome screen if it exists
  hideWelcomeScreen();

  // Add user message to chat
  addToChat("user", message);
  textarea.value = "";
  adjustTextareaHeight();

  // Show typing indicator
  showTyping(true);

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    addToChat("bot", data.response);
  } catch (err) {
    console.error("Error:", err);
    addToChat("bot", "⚠️ Something went wrong. Please try again.");
  } finally {
    showTyping(false);
  }
}

function addToChat(sender, message) {
  const chatMessages = document.getElementById("chat-messages");

  // Create message container
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container", sender);

  // Create avatar
  const avatar = document.createElement("div");
  avatar.classList.add("message-avatar");
  avatar.innerHTML = sender === "user" ? "👤" : "🧠";

  // Create message content
  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");

  // Create message bubble
  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");
  bubble.textContent = message;

  // Assemble the message
  messageContent.appendChild(bubble);
  messageContainer.appendChild(avatar);
  messageContainer.appendChild(messageContent);

  // Add to chat with animation
  messageContainer.style.opacity = "0";
  messageContainer.style.transform = "translateY(20px)";
  chatMessages.appendChild(messageContainer);

  // Animate in
  requestAnimationFrame(() => {
    messageContainer.style.transition = "all 0.3s ease";
    messageContainer.style.opacity = "1";
    messageContainer.style.transform = "translateY(0)";
  });

  // Scroll to bottom
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
}

function showTyping(show) {
  const typingIndicator = document.getElementById("typing-indicator");
  const chatMessages = document.getElementById("chat-messages");
  
  if (show) {
    typingIndicator.style.display = "block";
    // Scroll to show typing indicator
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  } else {
    typingIndicator.style.display = "none";
  }
}

function hideWelcomeScreen() {
  const welcomeScreen = document.querySelector(".welcome-screen");
  if (welcomeScreen) {
    welcomeScreen.style.transition = "all 0.4s ease";
    welcomeScreen.style.opacity = "0";
    welcomeScreen.style.transform = "translateY(-30px)";
    setTimeout(() => {
      welcomeScreen.remove();
    }, 400);
  }
}

function adjustTextareaHeight() {
  const textarea = document.getElementById("user-input");
  textarea.style.height = "auto";
  const newHeight = Math.min(textarea.scrollHeight, 120);
  textarea.style.height = newHeight + "px";
}

// Auto-resize textarea
document.getElementById("user-input").addEventListener("input", function() {
  adjustTextareaHeight();
  
  // Update send button state
  const sendBtn = document.getElementById("send-btn");
  if (this.value.trim()) {
    sendBtn.disabled = false;
    sendBtn.style.opacity = "1";
  } else {
    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.5";
  }
});

// Handle Enter key (send message) and Shift+Enter (new line)
document.getElementById("user-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

// Auto-focus input on page load
document.addEventListener("DOMContentLoaded", function() {
  const textarea = document.getElementById("user-input");
  textarea.focus();
  
  // Initialize send button state
  const sendBtn = document.getElementById("send-btn");
  sendBtn.disabled = true;
  sendBtn.style.opacity = "0.5";
});

// Handle window resize
window.addEventListener("resize", adjustTextareaHeight);

// Smooth scroll animations
function smoothScrollToBottom() {
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.scrollTo({
    top: chatMessages.scrollHeight,
    behavior: "smooth"
  });
}

// Add loading state management
function setLoadingState(loading) {
  const sendBtn = document.getElementById("send-btn");
  const textarea = document.getElementById("user-input");
  
  if (loading) {
    sendBtn.disabled = true;
    sendBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    `;
    sendBtn.style.opacity = "0.7";
    textarea.disabled = true;
  } else {
    sendBtn.disabled = textarea.value.trim() === "";
    sendBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m22 2-7 20-4-9-9-4z"/>
        <path d="M22 2 11 13"/>
      </svg>
    `;
    sendBtn.style.opacity = textarea.value.trim() ? "1" : "0.5";
    textarea.disabled = false;
    textarea.focus();
  }
}

// Update sendMessage function to use loading state
async function sendMessage() {
  const textarea = document.getElementById("user-input");
  const message = textarea.value.trim();
  if (!message) return;

  // Hide welcome screen if it exists
  hideWelcomeScreen();

  // Add user message to chat
  addToChat("user", message);
  textarea.value = "";
  adjustTextareaHeight();

  // Set loading state
  setLoadingState(true);

  // Show typing indicator
  showTyping(true);

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    addToChat("bot", data.response);
  } catch (err) {
    console.error("Error:", err);
    addToChat("bot", "⚠️ Something went wrong. Please try again.");
  } finally {
    showTyping(false);
    setLoadingState(false);
  }
}