// iOS-Style Knowledge Base Manager
// Fully functional with localStorage persistence

class KnowledgeBaseManager {
  constructor() {
    this.data = this.loadData();
    this.currentKeywords = [];
    this.currentCategory = 'pricing';
    this.currentFilter = 'all';
    this.initialize();
  }

  // Load data from localStorage
  loadData() {
    const stored = localStorage.getItem('knowledgeBase');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default data
    return {
      categories: [
        { id: 'pricing', name: 'Pricing', icon: '💰', color: '#34c759' },
        { id: 'delivery', name: 'Delivery', icon: '🚚', color: '#007aff' },
        { id: 'returns', name: 'Returns', icon: '↩️', color: '#ff9500' },
        { id: 'products', name: 'Products', icon: '📦', color: '#5856d6' },
        { id: 'technical', name: 'Technical', icon: '⚙️', color: '#af52de' },
        { id: 'contact', name: 'Contact', icon: '📞', color: '#ff3b30' }
      ],
      questions: []
    };
  }

  // Save data to localStorage
  saveData() {
    localStorage.setItem('knowledgeBase', JSON.stringify(this.data));
    this.updateStats();
    this.render();
  }

  // Initialize
  initialize() {
    // Initialize with sample data if empty
    if (this.data.questions.length === 0) {
      this.data.questions = [
        {
          id: Date.now(),
          question: "What are your pricing plans?",
          answer: "We offer three plans: Starter ($9/month), Professional ($29/month), and Enterprise (custom pricing). Each plan includes different features and support levels.",
          category: "pricing",
          keywords: ["pricing", "plans", "cost", "subscription"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now() + 1,
          question: "How long does delivery take?",
          answer: "Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available for an additional fee. International shipping takes 7-14 business days.",
          category: "delivery",
          keywords: ["delivery", "shipping", "time", "days"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now() + 2,
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for unused items in original packaging. Refunds are processed within 5-7 business days after we receive the returned item.",
          category: "returns",
          keywords: ["return", "refund", "policy", "money back"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now() + 3,
          question: "Do you offer product warranties?",
          answer: "Yes! All products come with a 1-year manufacturer warranty. Extended warranties (2-3 years) are available for purchase at checkout.",
          category: "products",
          keywords: ["warranty", "guarantee", "product", "coverage"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now() + 4,
          question: "How can I reset my password?",
          answer: "Go to the login page and click 'Forgot Password'. Enter your email address and we'll send you a reset link. The link expires in 24 hours.",
          category: "technical",
          keywords: ["password", "reset", "login", "forgot", "account"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.saveData();
    }

    this.setupEventListeners();
    this.updateStats();
    this.render();
  }

  // Setup event listeners
  setupEventListeners() {
    // Category tabs
    document.querySelectorAll('.ios-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ios-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentFilter = tab.dataset.filter;
        this.render();
      });
    });

    // Category picker in modal
    document.querySelectorAll('.ios-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ios-category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.dataset.category;
      });
    });

    // Search
    const searchInput = document.getElementById('knowledgeSearch');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.render());
    }
  }

  // Update statistics
  updateStats() {
    document.getElementById('totalQuestions').textContent = this.data.questions.length;
    document.getElementById('totalCategories').textContent = this.data.categories.length;
    
    const totalKeywords = this.data.questions.reduce((acc, q) => acc + q.keywords.length, 0);
    document.getElementById('totalKeywords').textContent = totalKeywords;

    const sorted = [...this.data.questions].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    if (sorted.length > 0) {
      document.getElementById('lastUpdated').textContent = this.formatDate(new Date(sorted[0].updatedAt));
    }
  }

  // Format date
  formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  }

  // Render knowledge cards
  render() {
    const container = document.getElementById('knowledgeList');
    const empty = document.getElementById('knowledgeEmpty');
    
    if (!container) return;
    
    let filtered = this.data.questions;
    
    // Filter by category
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(q => q.category === this.currentFilter);
    }
    
    // Filter by search
    const searchInput = document.getElementById('knowledgeSearch');
    const searchTerm = searchInput?.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchTerm) ||
        q.answer.toLowerCase().includes(searchTerm) ||
        q.keywords.some(k => k.toLowerCase().includes(searchTerm))
      );
    }

    if (filtered.length === 0) {
      container.style.display = 'none';
      empty.style.display = 'block';
      return;
    }

    container.style.display = 'block';
    empty.style.display = 'none';

    container.innerHTML = filtered.map(q => {
      const category = this.data.categories.find(c => c.id === q.category);
      return `
        <div class="ios-card" onclick="knowledgeManager.editQuestion(${q.id})">
          <div class="ios-card-header">
            <div class="ios-card-icon" style="background: ${category?.color || '#007aff'}20; color: ${category?.color || '#007aff'}">
              ${category?.icon || '📝'}
            </div>
            <div class="ios-card-title">
              <h3>${this.escapeHtml(q.question)}</h3>
              <div class="ios-card-preview">${this.escapeHtml(q.answer)}</div>
            </div>
            <div class="ios-card-actions">
              <button class="ios-action-btn" onclick="event.stopPropagation(); knowledgeManager.editQuestion(${q.id})">✏️</button>
              <button class="ios-action-btn" onclick="event.stopPropagation(); knowledgeManager.deleteQuestion(${q.id})">🗑️</button>
            </div>
          </div>
          <div class="ios-card-meta">
            <div class="ios-card-category">
              <span class="category-dot" style="background: ${category?.color || '#007aff'}"></span>
              ${category?.name || 'General'}
            </div>
            <div class="ios-card-date">${this.formatDate(new Date(q.updatedAt))}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Open modal for add/edit
  openModal(questionId = null) {
    const modal = document.getElementById('knowledgeModal');
    const title = document.getElementById('modalTitle');
    const deleteBtn = document.getElementById('deleteBtn');
    const keywordInput = document.getElementById('keywordInput');

    if (questionId) {
      const q = this.data.questions.find(x => x.id === questionId);
      if (q) {
        title.textContent = 'Edit Question';
        document.getElementById('editQuestionId').value = q.id;
        document.getElementById('questionText').value = q.question;
        document.getElementById('answerText').value = q.answer;
        this.currentCategory = q.category;
        this.currentKeywords = [...q.keywords];
        deleteBtn.style.display = 'block';
      }
    } else {
      title.textContent = 'Add New Question';
      document.getElementById('editQuestionId').value = '';
      document.getElementById('questionText').value = '';
      document.getElementById('answerText').value = '';
      this.currentCategory = 'pricing';
      this.currentKeywords = [];
      deleteBtn.style.display = 'none';
    }

    // Update category buttons
    document.querySelectorAll('.ios-category-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === this.currentCategory);
    });

    this.renderKeywords();
    if (keywordInput) keywordInput.value = '';
    modal.classList.add('show');
  }

  // Close modal
  closeModal() {
    document.getElementById('knowledgeModal').classList.remove('show');
  }

  // Render keywords
  renderKeywords() {
    const container = document.getElementById('keywordsContainer');
    const input = document.getElementById('keywordInput');
    if (!container || !input) return;

    container.querySelectorAll('.ios-keyword-tag').forEach(tag => tag.remove());
    
    this.currentKeywords.forEach(keyword => {
      const tag = document.createElement('span');
      tag.className = 'ios-keyword-tag';
      tag.innerHTML = `
        ${this.escapeHtml(keyword)}
        <button class="ios-keyword-remove" onclick="knowledgeManager.removeKeyword('${this.escapeHtml(keyword)}')">✕</button>
      `;
      container.insertBefore(tag, input);
    });
  }

  // Add keyword
  addKeyword(keyword) {
    keyword = keyword.trim().toLowerCase();
    if (keyword && !this.currentKeywords.includes(keyword)) {
      this.currentKeywords.push(keyword);
      this.renderKeywords();
    }
  }

  // Remove keyword
  removeKeyword(keyword) {
    this.currentKeywords = this.currentKeywords.filter(k => k !== keyword);
    this.renderKeywords();
  }

  // Save knowledge item
  save() {
    const questionId = document.getElementById('editQuestionId').value;
    const question = document.getElementById('questionText').value.trim();
    const answer = document.getElementById('answerText').value.trim();

    if (!question || !answer) {
      this.showToast('Please fill in both question and answer');
      return false;
    }

    if (questionId) {
      // Update existing
      const idx = this.data.questions.findIndex(q => q.id === parseInt(questionId));
      if (idx !== -1) {
        this.data.questions[idx] = {
          ...this.data.questions[idx],
          question,
          answer,
          category: this.currentCategory,
          keywords: [...this.currentKeywords],
          updatedAt: new Date().toISOString()
        };
      }
    } else {
      // Add new
      this.data.questions.push({
        id: Date.now(),
        question,
        answer,
        category: this.currentCategory,
        keywords: [...this.currentKeywords],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    this.saveData();
    this.closeModal();
    this.showToast(questionId ? 'Question updated!' : 'Question added!');
    return true;
  }

  // Edit question
  editQuestion(id) {
    this.openModal(id);
  }

  // Delete question
  deleteQuestion(id) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.data.questions = this.data.questions.filter(q => q.id !== id);
      this.saveData();
      this.closeModal();
      this.showToast('Question deleted!');
    }
  }

  // Export data
  export() {
    const dataStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'knowledge-base.json';
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Knowledge base exported!');
  }

  // Import data
  import(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.categories && imported.questions) {
          this.data = imported;
          this.saveData();
          this.showToast('Knowledge base imported!');
        }
      } catch (err) {
        this.showToast('Invalid file format');
      }
    };
    reader.readAsText(file);
  }

  // Show toast
  showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }

  // Escape HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Get all data for API
  getData() {
    return this.data;
  }

  // Search questions
  search(query) {
    const q = query.toLowerCase();
    return this.data.questions.filter(item =>
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.keywords.some(k => k.toLowerCase().includes(q))
    );
  }

  // Get answer for question
  getAnswer(question) {
    const q = question.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const item of this.data.questions) {
      let score = 0;
      
      // Check keywords
      for (const keyword of item.keywords) {
        if (q.includes(keyword.toLowerCase())) {
          score += keyword.length * 2;
        }
      }
      
      // Check question
      if (item.question.toLowerCase().includes(q)) {
        score += item.question.length;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    return bestMatch;
  }
}

// Initialize knowledge manager
let knowledgeManager;

document.addEventListener('DOMContentLoaded', () => {
  knowledgeManager = new KnowledgeBaseManager();
});

// Make globally accessible
window.knowledgeManager = knowledgeManager;

// Global functions
function openKnowledgeModal() {
  knowledgeManager.openModal();
}

function closeKnowledgeModal() {
  knowledgeManager.closeModal();
}

function saveKnowledge() {
  knowledgeManager.save();
}

function deleteKnowledge() {
  const questionId = document.getElementById('editQuestionId').value;
  if (questionId) {
    knowledgeManager.deleteQuestion(parseInt(questionId));
  }
}

function handleKeywordKeypress(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const input = document.getElementById('keywordInput');
    if (input) {
      knowledgeManager.addKeyword(input.value);
      input.value = '';
    }
  }
}

function filterKnowledge() {
  knowledgeManager.render();
}
