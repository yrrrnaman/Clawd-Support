# 🤖 AI Customer Support System

Professional AI-powered customer support system with WhatsApp integration and beautiful website widget.

![AI Customer Support](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 💬 Multi-Platform Support
- **WhatsApp Business API** integration
- **Beautiful Website Chat Widget**
- **Central Dashboard** for management

### 🎯 Core Features
- AI-powered responses (OpenAI/Claude ready)
- Knowledge base management
- Conversation analytics
- Human handoff option
- Real-time chat
- Response templates
- Multi-language support ready

### 📊 Dashboard Features
- Conversation monitoring
- Analytics & insights
- Knowledge base editor
- Settings management
- Agent assignment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or navigate to project
cd ai-customer-support

# Install dependencies
npm install

# Edit configuration
nano config.json

# Start the server
npm start
```

### Access URLs
- **Home:** http://localhost:3000
- **Dashboard:** http://localhost:3000/dashboard
- **Widget Demo:** http://localhost:3000/widget/demo
- **API:** http://localhost:3000/api/chat

## 📁 Project Structure

```
ai-customer-support/
├── config.json              # Configuration file (API keys, settings)
├── server.js               # Main server file
├── package.json            # Dependencies
├── README.md              # This file
├── data/
│   ├── knowledge_base.json # Q&A knowledge base
│   └── conversations.json   # Chat history (auto-generated)
└── public/
    └── widget.html        # Beautiful chat widget
```

## ⚙️ Configuration

### config.json Settings

```json
{
  "ai_settings": {
    "provider": "openai",
    "model": "gpt-4",
    "api_key": "YOUR_OPENAI_API_KEY",
    "temperature": 0.7
  },
  "whatsapp": {
    "enabled": true,
    "phone_number_id": "YOUR_PHONE_NUMBER_ID",
    "verify_token": "YOUR_VERIFY_TOKEN"
  },
  "dashboard": {
    "username": "admin",
    "password": "your_secure_password"
  }
}
```

### knowledge_base.json

Customize your Q&A:

```json
{
  "categories": [
    {
      "name": "Pricing",
      "keywords": ["price", "cost", "payment"],
      "responses": ["Response 1", "Response 2"]
    }
  ],
  "faqs": [
    {
      "question": "What is your return policy?",
      "answer": "30-day return policy..."
    }
  ],
  "business_info": {
    "company_name": "Your Company",
    "email": "support@company.com"
  }
}
```

## 🎨 Widget Customization

### Colors & Branding
Edit `config.json`:

```json
{
  "website": {
    "widget_color": "#6366f1",
    "company_name": "Your Company",
    "welcome_message": "Hi! How can I help?"
  }
}
```

### Widget Positioning
```json
{
  "website": {
    "widget_position": "bottom-right"  // or "bottom-left"
  }
}
```

## 📱 WhatsApp Setup

### 1. Create WhatsApp Business Account
- Visit: https://business.facebook.com
- Create WhatsApp Business profile

### 2. Get API Credentials
1. Go to Meta Developers: https://developers.facebook.com
2. Create App → Add WhatsApp product
3. Get credentials:
   - Phone Number ID
   - Access Token
   - Verify Token

### 3. Configure Webhook
```
Webhook URL: https://your-domain.com/webhook/whatsapp
Verify Token: YOUR_VERIFY_TOKEN
```

## 🔧 API Reference

### Send Message
```bash
POST /api/chat
Content-Type: application/json

{
  "message": "Hello",
  "platform": "whatsapp",
  "customer": "+1234567890"
}
```

### Get Conversations
```bash
GET /api/conversations
```

### Knowledge Base Stats
```bash
GET /api/knowledge/stats
```

## 🎯 Adding AI Intelligence

### OpenAI Integration

1. Get API Key: https://platform.openai.com/api-keys
2. Edit `config.json`:
```json
{
  "ai_settings": {
    "provider": "openai",
    "model": "gpt-4",
    "api_key": "sk-your-api-key-here"
  }
}
```

### Claude Integration

1. Get API Key: https://console.anthropic.com
2. Edit `config.json`:
```json
{
  "ai_settings": {
    "provider": "anthropic",
    "model": "claude-3-opus-20240307",
    "api_key": "your-anthropic-key"
  }
}
```

## 📊 Dashboard Overview

### Statistics Tracked
- Total conversations
- Messages per day
- Average response time
- Customer satisfaction
- Popular topics

### Analytics Features
- Conversation trends
- Peak hours
- Common questions
- Resolution rates

## 🛡️ Security

- Password-protected dashboard
- Encrypted conversations
- Rate limiting
- Input sanitization
- HTTPS ready

## 💰 Pricing Plans

### Free (Demo)
- Limited messages
- Basic widget
- Manual responses

### Pro ($29/month)
- Unlimited messages
- AI-powered responses
- WhatsApp integration
- Analytics
- Priority support

### Enterprise ($99/month)
- Everything in Pro
- Custom branding
- Multiple agents
- API access
- SLA guarantee

## 🚀 Deployment

### Render (Free)
```bash
# Push to GitHub
# Connect to Render
# Build Command: npm install
# Start Command: npm start
```

### Railway
```bash
# Install Railway CLI
railway init
railway up
```

### VPS (DigitalOcean/AWS)
```bash
# SSH into server
git clone <repo>
npm install
npm start
# Setup PM2 for production
pm2 start server.js --name ai-support
```

## 📝 Customization Guide

### Adding New Categories
Edit `data/knowledge_base.json`:

```json
{
  "categories": [
    {
      "name": "Shipping",
      "keywords": ["shipping", "delivery", "track"],
      "responses": [
        "Your order will arrive in 3-5 days.",
        "Track your order using the link in your email."
      ]
    }
  ]
}
```

### Adding FAQs
```json
{
  "faqs": [
    {
      "question": "What payment methods do you accept?",
      "answer": "We accept all major credit cards, UPI, and net banking."
    }
  ]
}
```

## 🐛 Troubleshooting

### Bot not responding?
- Check API keys in config.json
- Verify server is running
- Check console for errors

### WhatsApp not working?
- Verify webhook URL is accessible
- Check access token validity
- Ensure phone number is verified

### Widget not loading?
- Check browser console for errors
- Verify JavaScript is enabled
- Try a different browser

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - Feel free to use and modify!

## 🙏 Support

- Documentation: [docs folder]
- Issues: GitHub Issues
- Email: support@yourcompany.com

---

**Built with ❤️ for amazing customer experiences!**
