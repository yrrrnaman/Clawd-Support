const usersData = require('./data/users.json');
const fs = require('fs');

// Helper: Load conversations
function loadConversations() {
  try {
    if (fs.existsSync('./data/conversations.json')) {
      conversations = JSON.parse(fs.readFileSync('./data/conversations.json', 'utf8'));
    }
  } catch (err) {
    console.log('Starting with empty conversations');
  }
}

// API: Signup
app.post('/api/signup', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  const existingUser = usersData.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }
  
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
  
  res.json({ success: true, message: 'Account created successfully! Please login.' });
});

// API: Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }
  
  const user = usersData.users.find(u => u.email === email && u.password === password);
  
  if (user) {
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
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
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

// API: Get user profile
app.get('/api/user/profile', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const session = usersData.sessions[token];
  
  if (session) {
    const user = usersData.users.find(u => u.id === session.userId);
    if (user) {
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          created_at: user.created_at
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

// API: Update user profile
app.put('/api/user/profile', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const session = usersData.sessions[token];
  const { name, email } = req.body;
  
  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  const userIndex = usersData.users.findIndex(u => u.id === session.userId);
  if (userIndex !== -1) {
    if (name) usersData.users[userIndex].name = name;
    if (email) usersData.users[userIndex].email = email;
    fs.writeFileSync('./data/users.json', JSON.stringify(usersData, null, 2));
    res.json({ success: true, message: 'Profile updated' });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

// API: Change password
app.put('/api/user/password', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const session = usersData.sessions[token];
  const { currentPassword, newPassword } = req.body;
  
  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  const userIndex = usersData.users.findIndex(u => u.id === session.userId);
  if (userIndex !== -1) {
    if (usersData.users[userIndex].password === currentPassword) {
      usersData.users[userIndex].password = newPassword;
      fs.writeFileSync('./data/users.json', JSON.stringify(usersData, null, 2));
      res.json({ success: true, message: 'Password changed successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

// API: Get dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {
    total_conversations: conversations.length,
    today_conversations: conversations.filter(c => {
      const today = new Date().toDateString();
      return new Date(c.timestamp).toDateString() === today;
    }).length,
    total_messages: conversations.reduce((acc, c) => acc + c.messages.length, 0),
    active_users: [...new Set(conversations.map(c => c.user_id))].length,
    avg_response_time: '2.3s',
    satisfaction_rate: '94%',
    growth_rate: '+23%',
    bots_active: 3,
    integrations_connected: 5
  };
  res.json({ success: true, stats: stats });
});

// API: Get conversations
app.get('/api/conversations', (req, res) => {
  res.json({ success: true, conversations: conversations.slice(-50) });
});

// API: Knowledge base stats
app.get('/api/knowledge/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      categories: knowledgeBase.categories.length,
      faqs: knowledgeBase.faqs.length,
      company_info: Object.keys(knowledgeBase.business_info).length
    }
  });
});

// API: Get all users (admin only)
app.get('/api/admin/users', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const session = usersData.sessions[token];
  
  if (session && session.role === 'admin') {
    const users = usersData.users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      created_at: u.created_at
    }));
    res.json({ success: true, users: users });
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
});

// API: Get system settings
app.get('/api/settings/system', (req, res) => {
  res.json({
    success: true,
    settings: {
      site_name: config.website.company_name,
      site_url: config.website.widget_url || 'http://localhost:3000',
      theme: 'dark',
      language: 'en',
      timezone: 'UTC',
      maintenance_mode: false
    }
  });
});

// API: Update system settings
app.put('/api/settings/system', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const session = usersData.sessions[token];
  
  if (session && session.role === 'admin') {
    // In production, save to config
    res.json({ success: true, message: 'Settings updated' });
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
});

// API: Get integrations
app.get('/api/integrations', (req, res) => {
  res.json({
    success: true,
    integrations: [
      { id: 1, name: 'WhatsApp', status: 'connected', icon: 'fab fa-whatsapp', color: '#25D366' },
      { id: 2, name: 'Telegram', status: 'disconnected', icon: 'fab fa-telegram', color: '#0088cc' },
      { id: 3, name: 'Discord', status: 'disconnected', icon: 'fab fa-discord', color: '#5865F2' },
      { id: 4, name: 'Slack', status: 'disconnected', icon: 'fab fa-slack', color: '#4A154B' },
      { id: 5, name: 'OpenAI', status: 'connected', icon: 'fas fa-brain', color: '#10a37f' },
      { id: 6, name: 'Claude', status: 'disconnected', icon: 'fas fa-robot', color: '#d4a574' }
    ]
  });
});

// API: Toggle integration
app.post('/api/integrations/:id/toggle', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const session = usersData.sessions[token];
  
  if (session && session.role === 'admin') {
    res.json({ success: true, message: 'Integration toggled' });
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
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
╔═══════════════════════════════════════════════════════════╗
║      🤖 Clawd Support - AI Customer Chatbot             ║
╠═══════════════════════════════════════════════════════════╣
║  🌐 Server: http://localhost:${PORT}                        ║
║  📊 Dashboard: http://localhost:${PORT}/#dashboard          ║
║  💬 Widget: http://localhost:${PORT}/widget/demo           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
