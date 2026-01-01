# 🤖 AI Agents Marketplace - SaaS Platform

A comprehensive SaaS platform for selling AI agents with integrated payment processing, user authentication, live demos, and extensive documentation.

## 🌟 Features

- **500+ AI Agents Catalog**: Browse and purchase AI agents across multiple frameworks (CrewAI, AutoGen, LangGraph, Agno)
- **User Authentication**: Secure JWT-based authentication system
- **Payment Integration**: Stripe payment processing for agent purchases
- **Live Demos**: Try AI agents in real-time before purchasing
- **User Dashboard**: Manage purchased agents, API keys, and view usage statistics
- **Comprehensive Documentation**: Complete API reference and integration guides
- **Responsive Design**: Modern, mobile-friendly UI
- **Rate Limiting**: Built-in API rate limiting for security
- **RESTful API**: Clean API design for easy integration

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2.git
cd 500-ai-agents-projects-2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure your settings:
- `JWT_SECRET`: Your secret key for JWT tokens
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- Other configuration options as needed

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
500-ai-agents-projects-2/
├── public/                    # Frontend files
│   ├── index.html            # Landing page
│   ├── catalog.html          # Agent catalog
│   ├── login.html            # Login page
│   ├── signup.html           # Signup page
│   ├── dashboard.html        # User dashboard
│   ├── docs.html             # Documentation
│   ├── css/
│   │   └── styles.css        # Main stylesheet
│   └── js/
│       ├── main.js           # Main JavaScript
│       ├── auth.js           # Authentication logic
│       ├── catalog.js        # Catalog functionality
│       └── dashboard.js      # Dashboard functionality
├── server/                    # Backend files
│   ├── index.js              # Express server setup
│   ├── routes/               # API routes
│   │   ├── auth.js           # Authentication endpoints
│   │   ├── agents.js         # Agent management
│   │   ├── user.js           # User profile
│   │   ├── demo.js           # Demo execution
│   │   └── payment.js        # Payment processing
│   └── middleware/
│       └── auth.js           # JWT authentication middleware
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## 🔌 API Documentation

### Authentication

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/login
Login to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Agents

#### GET /api/agents
Get list of all available agents.

**Query Parameters:**
- `framework`: Filter by framework (crewai, autogen, langgraph, agno)
- `industry`: Filter by industry
- `search`: Search agents by name or description

#### POST /api/agents/purchase
Purchase an agent (requires authentication).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "agentId": 1
}
```

#### POST /api/agents/:id/execute
Execute an agent (requires authentication).

### Demo

#### POST /api/demo/execute
Execute a demo agent (public endpoint).

**Request Body:**
```json
{
  "agentId": "content-generator",
  "input": "Write a blog post about AI"
}
```

### User

#### GET /api/user/profile
Get user profile (requires authentication).

#### GET /api/user/purchases
Get list of purchased agents.

#### POST /api/user/regenerate-key
Regenerate API key.

## 💳 Payment Integration

The platform uses Stripe for payment processing. To set up:

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Add keys to your `.env` file:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Controlled cross-origin access
- **Helmet.js**: Security headers middleware
- **Environment Variables**: Sensitive data protection

## 🎨 Customization

### Adding New Agents

Edit `server/routes/agents.js` and add to the `agents` array:

```javascript
{
  id: 5,
  name: 'Your Agent Name',
  framework: 'crewai',
  industry: 'Your Industry',
  description: 'Agent description',
  price: 49,
  githubUrl: 'https://github.com/...'
}
```

### Styling

Modify `public/css/styles.css` to customize the appearance. CSS variables are defined at the top for easy theming:

```css
:root {
    --primary-color: #4f46e5;
    --secondary-color: #06b6d4;
    /* ... more variables */
}
```

## 🚀 Deployment

### Deploy to Production

1. Set `NODE_ENV=production` in your environment
2. Update `.env` with production values
3. Build and start:
```bash
npm start
```

### Deploy to Heroku

```bash
heroku create your-app-name
heroku config:set JWT_SECRET=your_secret
heroku config:set STRIPE_SECRET_KEY=your_key
git push heroku main
```

### Deploy to Vercel

```bash
vercel deploy
```

### Deploy to DigitalOcean/AWS/Azure

1. Create a droplet/instance
2. Install Node.js
3. Clone repository
4. Install dependencies
5. Set up environment variables
6. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server/index.js --name ai-agents-marketplace
pm2 save
pm2 startup
```

## 🧪 Testing

Run the test suite (when available):
```bash
npm test
```

## 📊 Monitoring

The platform includes health check endpoints:

```bash
GET /api/health
```

Returns server status and timestamp.

## 🤝 Contributing

See [CONTRIBUTION.md](CONTRIBUTION.md) for contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Visit the `/docs.html` page
- **Email**: support@aiagents.example
- **GitHub Issues**: [Create an issue](https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2/issues)

## 🎯 Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Advanced analytics dashboard
- [ ] Webhook support for agent events
- [ ] Multi-language support
- [ ] Agent marketplace ratings and reviews
- [ ] Team collaboration features
- [ ] Advanced agent customization options
- [ ] White-label solutions

## 🙏 Acknowledgments

- Built with Express.js, vanilla JavaScript, and modern CSS
- Powered by AI agent frameworks: CrewAI, AutoGen, LangGraph, and Agno
- Payment processing by Stripe
- Inspired by the AI automation community

---

Made with ❤️ for the AI community
