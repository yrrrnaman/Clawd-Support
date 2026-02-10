// ============================================
// Dashboard - Premium JavaScript
// ============================================

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeCharts();
  loadData();
  initializeTheme();
});

// Navigation
function initializeNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = item.getAttribute('data-section');

      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Show section
      sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
          section.classList.add('active');
        }
      });

      // Update page title
      updatePageTitle(item);
    });
  });
}

function updatePageTitle(navItem) {
  const titles = {
    overview: { title: 'Dashboard Overview', subtitle: 'Monitor and manage your AI customer support' },
    conversations: { title: 'Conversations', subtitle: 'View and manage customer conversations' },
    analytics: { title: 'Analytics', subtitle: 'Detailed performance metrics and insights' },
    knowledge: { title: 'Knowledge Base', subtitle: 'Manage Q&A and response templates' },
    templates: { title: 'Response Templates', subtitle: 'Create and edit message templates' },
    settings: { title: 'Settings', subtitle: 'Configure your AI support system' },
    users: { title: 'User Management', subtitle: 'Manage team members and permissions' }
  };

  const section = navItem.getAttribute('data-section');
  const info = titles[section];

  if (info) {
    document.getElementById('pageTitle').textContent = info.title;
    document.getElementById('pageSubtitle').textContent = info.subtitle;
  }
}

// Charts
function initializeCharts() {
  // Check if Chart.js is available
  if (typeof Chart === 'undefined') {
    console.log('Chart.js not loaded yet');
    return;
  }

  // Trend Chart
  const trendCtx = document.getElementById('trendChart');
  if (trendCtx) {
    new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Conversations',
          data: [120, 150, 180, 200, 170, 90, 130],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4
        }, {
          label: 'Resolved',
          data: [100, 130, 160, 180, 150, 80, 110],
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#22c55e',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Category Chart
  const categoryCtx = document.getElementById('categoryChart');
  if (categoryCtx) {
    new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: ['Pricing', 'Delivery', 'Products', 'Technical', 'Returns', 'Other'],
        datasets: [{
          data: [30, 25, 20, 15, 7, 3],
          backgroundColor: [
            '#6366f1',
            '#818cf8',
            '#a5b4fc',
            '#c7d2fe',
            '#22c55e',
            '#94a3b8'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        },
        cutout: '70%'
      }
    });
  }

  // Hourly Chart
  const hourlyCtx = document.getElementById('hourlyChart');
  if (hourlyCtx) {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const data = Array.from({ length: 24 }, () => Math.floor(Math.random() * 50));

    new Chart(hourlyCtx, {
      type: 'bar',
      data: {
        labels: hours,
        datasets: [{
          label: 'Activity',
          data: data,
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}

// Load Data
function loadData() {
  loadConversations();
  loadKnowledge();
  loadTemplates();
  loadUsers();
}

function loadConversations() {
  const conversations = [
    { id: '#1234', customer: 'John Doe', message: 'What are your pricing plans?', status: 'resolved', duration: '5 min' },
    { id: '#1235', customer: 'Jane Smith', message: 'How long does delivery take?', status: 'pending', duration: '2 min' },
    { id: '#1236', customer: 'Mike Johnson', message: 'Product not working properly', status: 'escalated', duration: '15 min' },
    { id: '#1237', customer: 'Sarah Wilson', message: 'Can I return my order?', status: 'resolved', duration: '3 min' },
    { id: '#1238', customer: 'Tom Brown', message: 'Technical issue with login', status: 'pending', duration: '8 min' }
  ];

  const tbody = document.getElementById('conversationsTable');
  if (tbody) {
    tbody.innerHTML = conversations.map(conv => `
      <tr>
        <td><strong>${conv.id}</strong></td>
        <td>
          <div class="user-cell">
            <div class="user-cell-avatar">👤</div>
            <div class="user-cell-info">
              <span class="user-cell-name">${conv.customer}</span>
            </div>
          </div>
        </td>
        <td>${conv.message}</td>
        <td><span class="status-badge ${conv.status}">${conv.status}</span></td>
        <td>${conv.duration}</td>
        <td>
          <button class="action-btn" onclick="viewConversation('${conv.id}')">👁️</button>
          <button class="action-btn" onclick="deleteConversation('${conv.id}')">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  // Recent conversations
  const recentContainer = document.getElementById('recentConversations');
  if (recentContainer) {
    recentContainer.innerHTML = conversations.slice(0, 3).map(conv => `
      <div class="activity-item">
        <div class="activity-avatar">👤</div>
        <div class="activity-content">
          <div class="activity-title">${conv.customer}</div>
          <div class="activity-time">${conv.message} • ${conv.duration} ago</div>
        </div>
        <span class="status-badge ${conv.status}">${conv.status}</span>
      </div>
    `).join('');
  }
}

function loadKnowledge() {
  const knowledge = [
    { id: 1, category: 'pricing', question: 'What are your pricing plans?', answer: 'We offer Basic ($9/mo), Pro ($29/mo), and Enterprise (custom) plans.' },
    { id: 2, category: 'delivery', question: 'How long does delivery take?', answer: 'Standard delivery takes 3-5 business days. Express delivery is available for 1-2 days.' },
    { id: 3, category: 'returns', question: 'What is your return policy?', answer: 'We offer a 30-day return policy. Items must be in original condition.' },
    { id: 4, category: 'products', question: 'Do you offer product warranties?', answer: 'All products come with a 1-year manufacturer warranty.' },
    { id: 5, category: 'technical', question: 'How can I reset my password?', answer: 'Go to Settings > Security > Reset Password or click "Forgot Password" on login page.' },
    { id: 6, category: 'contact', question: 'How can I contact support?', answer: 'Email us at support@example.com or call us at 1-800-EXAMPLE.' }
  ];

  const grid = document.getElementById('knowledgeGrid');
  if (grid) {
    grid.innerHTML = knowledge.map(item => `
      <div class="knowledge-card" data-category="${item.category}">
        <div class="knowledge-card-header">
          <span class="knowledge-category" style="background: ${getCategoryColor(item.category)}; color: white;">${item.category}</span>
          <div class="knowledge-actions">
            <button class="action-btn" onclick="editKnowledge(${item.id})">✏️</button>
            <button class="action-btn" onclick="deleteKnowledge(${item.id})">🗑️</button>
          </div>
        </div>
        <div class="knowledge-question">${item.question}</div>
        <div class="knowledge-answer">${item.answer}</div>
      </div>
    `).join('');
  }
}

function loadTemplates() {
  const templates = [
    { id: 1, name: 'Welcome Message', content: 'Hi {{name}}! 👋 Welcome to our support. How can I help you today?' },
    { id: 2, name: 'Thank You', content: 'Thank you for contacting us! 😊 If you have any other questions, feel free to ask.' },
    { id: 3, name: 'Escalation', content: 'I understand your concern. Let me connect you with a specialist who can better assist you.' },
    { id: 4, name: 'Follow Up', content: 'Just checking in! Did my previous answer help? Feel free to ask if you have more questions.' }
  ];

  const grid = document.getElementById('templatesGrid');
  if (grid) {
    grid.innerHTML = templates.map(tpl => `
      <div class="template-card">
        <div class="template-header">
          <span class="template-name">${tpl.name}</span>
          <div>
            <button class="action-btn" onclick="editTemplate(${tpl.id})">✏️</button>
            <button class="action-btn" onclick="deleteTemplate(${tpl.id})">🗑️</button>
          </div>
        </div>
        <div class="template-content">${tpl.content}</div>
        <button class="btn btn-primary" onclick="useTemplate(${tpl.id})">Use Template</button>
      </div>
    `).join('');
  }
}

function loadUsers() {
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', lastActive: '2 min ago' },
    { id: 2, name: 'Support Agent 1', email: 'agent1@example.com', role: 'agent', status: 'active', lastActive: '15 min ago' },
    { id: 3, name: 'Support Agent 2', email: 'agent2@example.com', role: 'agent', status: 'inactive', lastActive: '2 hours ago' },
    { id: 4, name: 'Viewer', email: 'viewer@example.com', role: 'viewer', status: 'active', lastActive: '1 day ago' }
  ];

  const tbody = document.getElementById('usersTable');
  if (tbody) {
    tbody.innerHTML = users.map(user => `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-cell-avatar">👤</div>
            <div class="user-cell-info">
              <span class="user-cell-name">${user.name}</span>
              <span class="user-cell-email">${user.email}</span>
            </div>
          </div>
        </td>
        <td>${user.email}</td>
        <td><span class="role-badge ${user.role}">${user.role}</span></td>
        <td><span class="status-dot ${user.status}"></span> ${user.status}</td>
        <td>${user.lastActive}</td>
        <td>
          <button class="action-btn" onclick="editUser(${user.id})">✏️</button>
          <button class="action-btn" onclick="deleteUser(${user.id})">🗑️</button>
        </td>
      </tr>
    `).join('');
  }
}

// Category Color Helper
function getCategoryColor(category) {
  const colors = {
    pricing: '#6366f1',
    delivery: '#22c55e',
    returns: '#ef4444',
    products: '#f59e0b',
    technical: '#8b5cf6',
    contact: '#06b6d4'
  };
  return colors[category] || '#94a3b8';
}

// Theme
function initializeTheme() {
  const savedTheme = localStorage.getItem('dashboardTheme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
}

// Section Show/Hide
function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('.nav-item');

  sections.forEach(section => section.classList.remove('active'));
  navItems.forEach(nav => nav.classList.remove('active'));

  document.getElementById(sectionId).classList.add('active');
  document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
}

// Modal Functions
function showQuickActions() {
  document.getElementById('quickActionsModal').classList.add('show');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

// Quick Actions
function exportData() {
  alert('Exporting data... This may take a moment.');
  closeModal('quickActionsModal');
}

function clearConversations() {
  if (confirm('Are you sure you want to clear all conversations? This cannot be undone.')) {
    alert('Conversations cleared!');
  }
  closeModal('quickActionsModal');
}

function regenerateResponses() {
  alert('Regenerating responses...');
  closeModal('quickActionsModal');
}

function testWebhook() {
  alert('Testing webhook...');
  closeModal('quickActionsModal');
}

// Conversation Actions
function viewConversation(id) {
  alert(`Viewing conversation ${id}`);
}

function deleteConversation(id) {
  if (confirm(`Delete conversation ${id}?`)) {
    alert(`Conversation ${id} deleted`);
  }
}

// Knowledge Actions
function addKnowledgeItem() {
  alert('Add knowledge item modal would open here');
}

function editKnowledge(id) {
  alert(`Editing knowledge item ${id}`);
}

function deleteKnowledge(id) {
  if (confirm(`Delete knowledge item ${id}?`)) {
    alert(`Knowledge item ${id} deleted`);
  }
}

// Template Actions
function addTemplate() {
  alert('Add template modal would open here');
}

function editTemplate(id) {
  alert(`Editing template ${id}`);
}

function deleteTemplate(id) {
  if (confirm(`Delete template ${id}?`)) {
    alert(`Template ${id} deleted`);
  }
}

function useTemplate(id) {
  alert(`Template ${id} copied to clipboard`);
}

// User Actions
function addUser() {
  alert('Add user modal would open here');
}

function editUser(id) {
  alert(`Editing user ${id}`);
}

function deleteUser(id) {
  if (confirm(`Delete user ${id}?`)) {
    alert(`User ${id} deleted`);
  }
}

// Pagination
function changePage(direction) {
  const currentPage = document.getElementById('currentPage');
  let page = parseInt(currentPage.textContent);

  if (direction === 'next') {
    page++;
  } else if (direction === 'prev' && page > 1) {
    page--;
  }

  currentPage.textContent = page;
  loadConversations(); // Reload data for page
}

// Export Conversations
function exportConversations() {
  alert('Exporting conversations as CSV...');
}

// Settings
function saveSettings() {
  alert('Settings saved successfully! 💾');
}

function resetSettings() {
  if (confirm('Reset all settings to default?')) {
    alert('Settings reset to default!');
  }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('show');
  }
});
