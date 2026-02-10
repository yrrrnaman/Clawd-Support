// ============================================
// AI Chat Widget - Premium JavaScript
// ============================================

class AIChatWidget {
  constructor(config = {}) {
    this.config = {
      companyName: config.companyName || 'AI Assistant',
      companyLogo: config.companyLogo || '🤖',
      primaryColor: config.primaryColor || '#667eea',
      theme: config.theme || 'light',
      apiUrl: config.apiUrl || '/api/chat',
      ...config
    };

    this.isOpen = false;
    this.messages = [];
    this.isTyping = false;
    this.currentTheme = this.config.theme;

    this.init();
  }

  init() {
    this.createWidget();
    this.bindEvents();
    this.loadTheme();
  }

  createWidget() {
    const container = document.createElement('div');
    container.className = 'chat-widget-container';
    container.innerHTML = `
      <!-- Chat Window -->
      <div class="chat-window ${this.isOpen ? 'open' : ''}" id="chatWindow">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">
              ${this.config.companyLogo}
              <div class="online-indicator"></div>
            </div>
            <div>
              <h2 class="chat-title">${this.config.companyName}</h2>
              <p class="chat-subtitle">
                <span class="status-dot"></span>
                <span class="connection-status">Online</span>
              </p>
              <p style="font-size: 10px; opacity: 0.6; margin-top: 2px;">🚀 Created by Naman AI Agent Clawd</p>
            </div>
          </div>
          <div class="chat-header-actions">
            <button class="chat-header-btn theme-toggle" title="Toggle Theme" onclick="chatWidget.toggleTheme()">
              ${this.getThemeIcon()}
            </button>
            <button class="chat-header-btn" title="Settings" onclick="chatWidget.showSettings()">
              ⚙️
            </button>
            <button class="chat-header-btn" title="Minimize" onclick="chatWidget.toggle()">
              ➖
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="chat-messages" id="chatMessages">
          <!-- Messages will be inserted here -->
        </div>

        <!-- Emoji Picker -->
        <div class="emoji-picker" id="emojiPicker">
          <div class="emoji-grid">
            ${this.getEmojis()}
          </div>
        </div>

        <!-- Quick Replies -->
        <div class="chat-quick-replies" id="quickReplies" style="display: none;">
          <!-- Quick reply buttons will be inserted here -->
        </div>

        <!-- Input Area -->
        <div class="chat-input-area">
          <div class="chat-input-wrapper">
            <div class="chat-input-actions">
              <button class="chat-input-btn" onclick="chatWidget.showEmojiPicker()" title="Emoji">
                😊
              </button>
              <button class="chat-input-btn" onclick="chatWidget.triggerFileUpload()" title="Attachment">
                📎
              </button>
            </div>
            <textarea
              class="chat-input"
              id="chatInput"
              placeholder="Type your message..."
              rows="1"
              onkeydown="chatWidget.handleKeydown(event)"
              oninput="chatWidget.autoResize(this)"
            ></textarea>
            <button
              class="chat-send-btn"
              id="sendBtn"
              onclick="chatWidget.sendMessage()"
              title="Send"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      <!-- Toggle Button -->
      <button class="chat-toggle-btn ${this.isOpen ? 'open' : ''}" onclick="chatWidget.toggle()">
        💬
        <span class="notification-badge" id="notificationBadge" style="display: none;">1</span>
      </button>
    `;

    document.body.appendChild(container);

    this.chatWindow = document.getElementById('chatWindow');
    this.chatMessages = document.getElementById('chatMessages');
    this.chatInput = document.getElementById('chatInput');
    this.quickReplies = document.getElementById('quickReplies');
    this.emojiPicker = document.getElementById('emojiPicker');
    this.toggleBtn = document.querySelector('.chat-toggle-btn');

    // Set CSS variable for primary color
    document.documentElement.style.setProperty('--chat-send-btn', `linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.getSecondaryColor()} 100%)`);
    
    // Set SF Pro font
    document.documentElement.style.setProperty('--chat-font', '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif');
  }

  getThemeIcon() {
    return this.currentTheme === 'dark' ? '☀️' : '🌙';
  }

  getSecondaryColor() {
    // Lighten the primary color for gradient
    const colors = {
      '#667eea': '#764ba2',
      '#3b82f6': '#8b5cf6',
      '#10b981': '#059669',
      '#f59e0b': '#d97706',
      '#ef4444': '#dc2626'
    };
    return colors[this.config.primaryColor] || '#764ba2';
  }

  getEmojis() {
    const emojis = [
      // Smileys
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜',
      // Gestures
      '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👋', '🖐️', '✋', '🖖', '👏', '🙌', '👐', '🤲', '🤝', '🙏',
      // Hearts
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝',
      // Objects
      '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '⭐', '🔥', '💡', '📌', '📍', '✅', '❌', '⚠️', '❓', '❗', '💯', '🙈', '🙉', '🙊',
      // Business
      '💼', '📊', '📈', '📉', '💰', '💳', '💵', '📱', '💻', '🖥️', '⌨️', '🖱️', '💾', '📁', '📝', '✏️', '📞', '📧', '📩', '📤'
    ];
    return emojis.map(e => `<div class="emoji-item" onclick="chatWidget.insertEmoji('${e}')">${e}</div>`).join('');
  }

  bindEvents() {
    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.emoji-picker') && !e.target.closest('.chat-input-btn')) {
        this.emojiPicker.classList.remove('show');
      }
    });

    // Close chat when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.toggle();
      }
    });

    // Initial greeting
    setTimeout(() => {
      this.addMessage('ai', `Hi! 👋 I'm ${this.config.companyName}. How can I help you today?`);
      this.showQuickReplies(['💬 Get Started', '❓ FAQ', '📞 Contact Us', 'ℹ️ About']);
    }, 500);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('chatTheme') || this.config.theme;
    this.setTheme(savedTheme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    localStorage.setItem('chatTheme', newTheme);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
      themeBtn.innerHTML = this.getThemeIcon();
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.chatWindow.classList.toggle('open', this.isOpen);
    this.toggleBtn.classList.toggle('open', this.isOpen);

    if (this.isOpen) {
      this.chatInput.focus();
      this.hideNotification();
    }
  }

  showEmojiPicker() {
    this.emojiPicker.classList.toggle('show');
  }

  insertEmoji(emoji) {
    this.chatInput.value += emoji;
    this.emojiPicker.classList.remove('show');
    this.chatInput.focus();
  }

  handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  triggerFileUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        this.addMessage('user', `📎 ${file.name}`);
        // Handle file upload here
      }
    };
    input.click();
  }

  showSettings() {
    this.addMessage('ai', '⚙️ Settings panel coming soon!');
  }

  async sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message || this.isTyping) return;

    this.chatInput.value = '';
    this.chatInput.style.height = 'auto';
    this.quickReplies.style.display = 'none';

    this.addMessage('user', message);
    await this.simulateTyping();

    await this.getAIResponse(message);
  }

  async getAIResponse(userMessage) {
    try {
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (data.success) {
        this.addMessage('ai', data.response);

        if (data.quickReplies && data.quickReplies.length > 0) {
          this.showQuickReplies(data.quickReplies);
        }
      } else {
        this.addMessage('ai', 'Sorry, I encountered an error. Please try again. 🤔');
      }
    } catch (error) {
      console.error('Chat error:', error);
      this.addMessage('ai', 'Sorry, I'm having trouble connecting. Please try again. 🌐');
    }
  }

  async simulateTyping() {
    this.isTyping = true;
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message ai typing-indicator';
    typingIndicator.id = 'typingIndicator';
    typingIndicator.innerHTML = `
      <div class="chat-message-avatar">${this.config.companyLogo}</div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    this.chatMessages.appendChild(typingIndicator);
    this.scrollToBottom();

    // Simulate typing delay (1-2 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    typingIndicator.remove();
    this.isTyping = false;
  }

  addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
      <div class="chat-message-avatar">${type === 'user' ? '👤' : this.config.companyLogo}</div>
      <div class="chat-message-content">
        ${this.formatMessage(content)}
        <span class="chat-message-time">${time}</span>
        ${type === 'ai' ? `
        <div class="message-reactions">
          <button class="reaction-btn" onclick="chatWidget.addReaction(this, '👍')">👍</button>
          <button class="reaction-btn" onclick="chatWidget.addReaction(this, '❤️')">❤️</button>
          <button class="reaction-btn" onclick="chatWidget.addReaction(this, '😂')">😂</button>
          <button class="reaction-btn" onclick="chatWidget.addReaction(this, '😮')">😮</button>
        </div>
        ` : ''}
      </div>
    `;

    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();

    // Play notification sound if chat is closed
    if (!this.isOpen && type === 'ai') {
      this.showNotification();
    }
  }

  formatMessage(text) {
    // Convert URLs to links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: inherit;">$1</a>');

    // Convert line breaks to <br>
    text = text.replace(/\n/g, '<br>');

    // Bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic text
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    return text;
  }

  addReaction(button, emoji) {
    const reactions = button.parentElement;
    const existingReaction = reactions.querySelector(`span[data-emoji="${emoji}"]`);

    if (existingReaction) {
      const count = parseInt(existingReaction.textContent.match(/\d+/)[0]) + 1;
      existingReaction.innerHTML = `${emoji} ${count}`;
    } else {
      const reactionSpan = document.createElement('span');
      reactionSpan.setAttribute('data-emoji', emoji);
      reactionSpan.innerHTML = `${emoji} 1`;
      reactionSpan.style.cssText = 'background: #f1f5f9; padding: 4px 8px; border-radius: 12px; font-size: 12px; cursor: pointer;';
      reactions.appendChild(reactionSpan);
    }
  }

  showQuickReplies(replies) {
    this.quickReplies.innerHTML = replies.map(reply =>
      `<button class="chat-quick-btn" onclick="chatWidget.sendQuickReply('${reply.replace(/'/g, "\\'")}')">${reply}</button>`
    ).join('');
    this.quickReplies.style.display = 'flex';
    this.scrollToBottom();
  }

  sendQuickReply(reply) {
    this.chatInput.value = reply;
    this.sendMessage();
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  showNotification() {
    const badge = document.getElementById('notificationBadge');
    badge.style.display = 'flex';
    badge.textContent = '1';
  }

  hideNotification() {
    const badge = document.getElementById('notificationBadge');
    badge.style.display = 'none';
  }
}

// Initialize widget when DOM is ready
let chatWidget;
document.addEventListener('DOMContentLoaded', () => {
  // Get config from window object (set by server)
  const config = window.ChatWidgetConfig || {};
  chatWidget = new AIChatWidget(config);
});

// Make accessible globally
window.chatWidget = chatWidget;
