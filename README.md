# 🤖 AI Agents SaaS Marketplace

A modern, production-ready SaaS platform for discovering, trying, and purchasing AI agents. Built with Next.js, TypeScript, Stripe, and Firebase.

> **Note:** This is the marketplace platform scaffold. For the original AI agents collection, see [README_ORIGINAL.md](./README_ORIGINAL.md).

![Platform Status](https://img.shields.io/badge/status-development-orange)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

- ✅ **Modern Tech Stack** - Next.js 14, TypeScript, Tailwind CSS
- ✅ **Authentication** - Firebase Auth with email/password and Google sign-in
- ✅ **Payments** - Stripe Checkout integration for subscriptions and one-time payments
- ✅ **Interactive Demos** - Embed Gradio/Streamlit/HuggingFace Space demos
- ✅ **Responsive Design** - Mobile-first, accessible UI
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **CI/CD Ready** - GitHub Actions workflow included
- ✅ **Documentation** - Comprehensive docs for agents and demos

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier works)
- Stripe account (test mode)

### Installation

1. **Clone and install dependencies:**
```bash
git clone https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2.git
cd 500-ai-agents-projects-2
npm install
```

2. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials (see [Configuration](#configuration) below).

3. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Configuration

### Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication > Sign-in method > Email/Password and Google
3. Copy your web app config to `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Stripe Setup

1. Create a Stripe account at [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Get your test API keys from [API Keys page](https://dashboard.stripe.com/test/apikeys)
3. Add to `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

4. Create products and prices in Stripe Dashboard
5. Update price IDs in `pages/index.tsx`

### Stripe Webhook (for production)

1. Create webhook endpoint in [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
2. Set URL to: `https://yourdomain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`
4. Add webhook secret to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

**For local testing:**
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 📁 Project Structure

```
.
├── pages/                  # Next.js pages
│   ├── index.tsx          # Homepage with agents catalog
│   ├── demo/[agent].tsx   # Demo page template
│   └── api/               # API routes
│       ├── stripe/        # Stripe integration
│       ├── auth/          # Authentication endpoints
│       └── user/          # User management
├── components/            # React components
│   ├── Auth/             # Authentication components
│   └── BuyButton.tsx     # Stripe checkout component
├── hooks/                # Custom React hooks
│   └── useAuth.tsx       # Authentication hook
├── lib/                  # Utility libraries
│   └── firebase.ts       # Firebase configuration
├── styles/               # Global styles
│   └── globals.css       # Tailwind CSS
├── docs/                 # Agent documentation
│   ├── README.md         # Documentation guide
│   └── agent-template.md # Template for agent docs
├── demo/                 # Demo setup guides
│   └── README.md         # How to create and host demos
└── public/               # Static assets
```

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript compiler check
npm test            # Run tests (TODO: Add tests)
```

### Code Quality

The project includes:
- **ESLint** - Code linting with Next.js and TypeScript rules
- **Prettier** - Code formatting
- **TypeScript** - Type safety
- **GitHub Actions** - Automated CI/CD pipeline

## 📚 Documentation

- **[Agent Documentation Guide](./docs/README.md)** - How to document AI agents
- **[Agent Template](./docs/agent-template.md)** - Template for new agents
- **[Demo Setup Guide](./demo/README.md)** - How to create and host demos

## 🎯 Next Steps After Setup

### For Repository Owner

After merging this PR, complete these steps:

#### 1. Environment Configuration
- [ ] Add all environment variables to Vercel (or your hosting platform)
- [ ] Set up Firebase project and add credentials
- [ ] Set up Stripe account and add API keys
- [ ] Configure Stripe webhook endpoint
- [ ] Test authentication flow (sign up, sign in, Google auth)
- [ ] Test Stripe checkout with test cards

#### 2. Content & Data
- [ ] Replace placeholder agent data in `pages/index.tsx` with real agents
- [ ] Add real Stripe Price IDs for each agent
- [ ] Create agent documentation using the template
- [ ] Set up database for user and purchase data (optional but recommended)

#### 3. Demos
- [ ] Deploy agent demos to Gradio/Streamlit/HuggingFace Spaces
- [ ] Update demo URLs in `pages/demo/[agent].tsx`
- [ ] Test iframe embedding
- [ ] Add authentication to demos if needed

#### 4. Deployment
- [ ] Deploy to Vercel (recommended) or other hosting platform
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and error tracking (Sentry recommended)
- [ ] Enable analytics (Google Analytics, Mixpanel, etc.)

#### 5. Security & Compliance
- [ ] Review and update CORS settings
- [ ] Add rate limiting to API routes
- [ ] Implement proper error handling
- [ ] Add logging for audit trails
- [ ] Review data privacy policies
- [ ] Add terms of service and privacy policy pages

#### 6. Testing
- [ ] Test all payment flows end-to-end
- [ ] Test authentication on all browsers
- [ ] Mobile responsiveness testing
- [ ] Performance testing
- [ ] Security audit

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker container

See [Next.js deployment docs](https://nextjs.org/docs/deployment) for details.

## 🔒 Security

- **Never commit `.env.local`** - It contains secrets
- **Use test mode** for Stripe during development
- **Validate all inputs** on the server side
- **Implement rate limiting** for API routes
- **Use HTTPS** in production
- **Keep dependencies updated** - Run `npm audit` regularly

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTION.md](./CONTRIBUTION.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation:** Check the `/docs` directory
- **Issues:** [GitHub Issues](https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2/issues)
- **Discussions:** [GitHub Discussions](https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2/discussions)

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Stripe](https://stripe.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- And many other amazing open-source projects

---

**Built with ❤️ for the AI community**
