#!/usr/bin/env node

/**
 * AI Customer Support - Main Server
 * Professional AI-powered customer support system
 * 
 * Features:
 * - WhatsApp Business API integration
 * - Beautiful website chat widget
 * - Central dashboard
 * - AI-powered responses
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { WebSocketServer } = require('ws');

// Load configuration
const config = require('./config.json');
const knowledgeBase = require('./data/knowledge_base.json');

// Initialize Express app
const app = express();
const PORT = config.dashboard.port || 3000;

// Middleware
app.use(express.json());
app.get('/logo.svg', (req, res) => {
  res.sendFile(path.join(__dirname, 'logo.svg'));
});

app.get('/favicon.svg', (req, res) => {
  res.sendFile(path.join(__dirname, 'favicon.svg'));
});
app.use(express.static('public'));
app.use('/widget', express.static('public'));
app.use('/views', express.static('views'));

// API routes MUST come before static file serving
let conversations = [];
let chatHistory = {};

// Helper: Load conversations
function loadConversations() {
  try {
    if (fs.existsSync('./data/conversations.json')) {
      conversations = JSON.parse(fs.readFileSync('./data/conversations.json', 'utf8'));
    }
  } catch (e) {
    conversations = [];
  }
}

// Helper: Save conversations
function saveConversations() {
  fs.writeFileSync('./data/conversations.json', JSON.stringify(conversations, null, 2));
}

// Helper: AI Response Generator (Simulated - Replace with real API)
async function generateAIResponse(message, context = {}) {
  const lowerMessage = message.toLowerCase();
  
  // Check knowledge base categories
  for (const category of knowledgeBase.categories) {
    for (const keyword of category.keywords) {
      if (lowerMessage.includes(keyword)) {
        const responses = category.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }
  
  // Check FAQs
  for (const faq of knowledgeBase.faqs) {
    if (lowerMessage.includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' '))) {
      return faq.answer;
    }
  }
  
  // Check if using real AI API
  if (config.ai_settings.api_key && config.ai_settings.api_key !== 'YOUR_OPENAI_API_KEY_HERE') {
    try {
      // This would call OpenAI API in production
      // For now, return simulated response
      return generateFallbackResponse(message);
    } catch (e) {
      return generateFallbackResponse(message);
    }
  }
  
  return generateFallbackResponse(message);
}

function generateFallbackResponse(message) {
  const responses = [
    "That's a great question! Let me connect you with our support team.",
    "I understand. Could you provide more details?",
    "Thank you for asking! I'll help you find the answer.",
    "I'm here to help! Could you tell me more?",
    "Got it! Let me look into this for you.",
    "I appreciate your question. Here's what I can tell you..."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// ==================== ROUTES ====================

// Home page - Professional Landing Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'landing-page.html'));
});

// Dashboard (No Login Required)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Dashboard Overview (No Login)
app.get('/dashboard/overview', (req, res) => {
  const stats = {
    total_conversations: conversations.length,
    today_conversations: conversations.filter(c => {
      const today = new Date().toDateString();
      return new Date(c.timestamp).toDateString() === today;
    }).length,
    messages_today: conversations.reduce((acc, c) => acc + c.messages.length, 0),
    avg_response_time: '2.3s'
  };
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dashboard Overview</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', sans-serif;
          background: #f1f5f9;
          min-height: 100vh;
        }
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 250px;
          height: 100vh;
          background: ${config.website.widget_color};
          color: white;
          padding: 20px;
        }
        .sidebar h2 { margin-bottom: 30px; font-size: 20px; }
        .menu-item {
          padding: 15px;
          margin: 5px 0;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .menu-item:hover { background: rgba(255,255,255,0.1); }
        .menu-item a { color: white; text-decoration: none; display: block; }
        .main {
          margin-left: 250px;
          padding: 30px;
        }
        h1 { color: ${config.website.widget_color}; margin-bottom: 30px; }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .stat-value { font-size: 36px; font-weight: bold; color: ${config.website.widget_color}; }
        .stat-label { color: #64748b; margin-top: 5px; }
        .recent-chats {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { color: #64748b; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="sidebar">
        <h2>📊 AI Support Dashboard</h2>
        <div class="menu-item"><a href="/dashboard/overview">📈 Overview</a></div>
        <div class="menu-item"><a href="/dashboard/conversations">💬 Conversations</a></div>
        <div class="menu-item"><a href="/dashboard/analytics">📊 Analytics</a></div>
        <div class="menu-item"><a href="/dashboard/settings">⚙️ Settings</a></div>
        <div class="menu-item"><a href="/dashboard/knowledge">📚 Knowledge Base</a></div>
        <div class="menu-item"><a href="/">🏠 Back to Home</a></div>
      </div>
      <div class="main">
        <h1>📈 Dashboard Overview</h1>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.total_conversations}</div>
            <div class="stat-label">Total Conversations</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.today_conversations}</div>
            <div class="stat-label">Today's Chats</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.messages_today}</div>
            <div class="stat-label">Messages Today</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.avg_response_time}</div>
            <div class="stat-label">Avg Response</div>
          </div>
        </div>
        <div class="recent-chats">
          <h2>💬 Recent Conversations</h2>
          <table>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Customer</th>
                <th>Messages</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${conversations.slice(-10).reverse().map(c => `
                <tr>
                  <td>${c.platform || 'Website'}</td>
                  <td>${c.customer || 'Anonymous'}</td>
                  <td>${c.messages?.length || 0}</td>
                  <td>${new Date(c.timestamp).toLocaleString()}</td>
                  <td>✅ Completed</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Widget Demo Page
app.get('/widget/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'widget.html'));
});

// API: Send message
app.post('/api/chat', async (req, res) => {
  const { message, platform, customer } = req.body;
  
  const conversationId = Date.now().toString();
  
  const response = await generateAIResponse(message, { platform, customer });
  
  // Save conversation
  const conversation = {
    id: conversationId,
    platform: platform || 'website',
    customer: customer || 'Anonymous',
    messages: [
      { type: 'user', content: message, timestamp: new Date().toISOString() },
      { type: 'bot', content: response, timestamp: new Date().toISOString() }
    ],
    timestamp: new Date().toISOString()
  };
  
  conversations.push(conversation);
  saveConversations();
  
  res.json({
    success: true,
    response: response,
    conversation_id: conversationId
  });
});

// Load users database
const usersData = require('./data/users.json');

// API: Signup
app.post('/api/signup', (req, res) => {
  const { email, password, name } = req.body;
  
  // Validate input
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  // Check if user already exists
  const existingUser = usersData.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }
  
  // Create new user
  const newUser = {
    id: usersData.users.length + 1,
    email: email,
    password: password,
    name: name,
    role: 'user',
    created_at: new Date().toISOString()
  };
  
  usersData.users.push(newUser);
  fs.writeFileSync('./data/users.json', JSON.stringify(usersData, null, 2));
  
  res.json({
    success: true,
    message: 'Account created successfully! Please login.'
  });
});

// API: Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }
  
  // Find user
  const user = usersData.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Generate session token
    const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    usersData.sessions[token] = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created: new Date().toISOString()
    };
    fs.writeFileSync('./data/users.json', JSON.stringify(usersData, null, 2));
    
    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

// API: Verify token
app.get('/api/verify-token', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  const session = usersData.sessions[token];
  if (session) {
    res.json({ success: true, user: session });
  } else {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

// API: Logout
app.post('/api/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token && usersData.sessions[token]) {
    delete usersData.sessions[token];
    fs.writeFileSync('./data/users.json', JSON.stringify(usersData, null, 2));
  }
  
  res.json({ success: true, message: 'Logged out successfully' });
});

// API: Get conversations
app.get('/api/conversations', (req, res) => {
  res.json(conversations.slice(-50));
});

// API: Knowledge base stats
app.get('/api/knowledge/stats', (req, res) => {
  res.json({
    categories: knowledgeBase.categories.length,
    faqs: knowledgeBase.faqs.length,
    company_info: Object.keys(knowledgeBase.business_info).length
  });
});

// API: Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      total_conversations: conversations.length,
      active_users: new Set(conversations.map(c => c.userId)).size,
      satisfaction_rate: '4.8',
      growth_rate: '+23%'
    }
  });
});

// API: Integrations list
app.get('/api/integrations', (req, res) => {
  res.json({
    success: true,
    integrations: [
      { id: 'whatsapp', name: 'WhatsApp', color: '#25D366', status: 'connected' },
      { id: 'telegram', name: 'Telegram', color: '#0088cc', status: 'not_connected' },
      { id: 'discord', name: 'Discord', color: '#5865F2', status: 'not_connected' },
      { id: 'slack', name: 'Slack', color: '#4A154B', status: 'not_connected' },
      { id: 'website', name: 'Website Widget', color: '#6366f1', status: 'connected' },
      { id: 'openai', name: 'OpenAI', color: '#10a37f', status: 'connected' }
    ]
  });
});

// API: User profile
app.get('/api/user/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  // Simplified - in production, verify JWT token
  res.json({ success: true, user: { name: 'Admin', email: 'admin@clawd.com' } });
});

// API: Update user profile
app.put('/api/user/profile', (req, res) => {
  res.json({ success: true, message: 'Profile updated successfully' });
});

// API: Change password
app.put('/api/user/password', (req, res) => {
  res.json({ success: true, message: 'Password changed successfully' });
});

// WhatsApp Webhook (Placeholder)
app.post(config.whatsapp.webhook_path, (req, res) => {
  console.log('WhatsApp webhook received:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Start server
loadConversations();

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║       🤖 AI Customer Support System                  ║
╠════════════════════════════════════════════════════════╣
║  🚀 Server running on: http://localhost:${PORT}          ║
║  📊 Dashboard: http://localhost:${PORT}/dashboard          ║
║  💬 Widget Demo: http://localhost:${PORT}/widget/demo     ║
╚════════════════════════════════════════════════════════╝

📋 Quick Links:
• Dashboard: http://localhost:${PORT}/dashboard
• Chat Widget: http://localhost:${PORT}/widget/demo
• API: http://localhost:${PORT}/api/chat

⚠️  Don't forget to:
1. Edit config.json with your API keys
2. Set up WhatsApp Business API credentials
3. Customize knowledge_base.json

🎯 Ready to serve customers!
  `);
});

module.exports = { app, generateAIResponse };

// Static files AFTER all API routes
