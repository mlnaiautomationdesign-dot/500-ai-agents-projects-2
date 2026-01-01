# 🤖 AI Agents Marketplace - SaaS Platform

A modern Next.js-based SaaS platform for discovering, purchasing, and deploying AI agents. This platform transforms the 500+ AI Agents Projects repository into a fully-featured marketplace with Stripe payments, Firebase authentication, and interactive demos.

## 🌟 Features

- **Modern Tech Stack**: Built with Next.js 13+, TypeScript, and Tailwind CSS
- **Secure Payments**: Integrated Stripe Checkout for seamless transactions
- **Authentication**: Firebase Authentication with email/password and Google sign-in
- **Interactive Demos**: Support for Gradio, Streamlit, and HuggingFace Spaces demos
- **Responsive Design**: Mobile-first, beautiful UI with Tailwind CSS
- **Type-Safe**: Full TypeScript support for better developer experience
- **CI/CD Ready**: GitHub Actions workflow for automated testing and deployment

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Development](#-development)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Next Steps](#-next-steps)
- [Documentation](#-documentation)

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Firebase account (free tier is fine)
- Stripe account (test mode is fine for development)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2.git
cd 500-ai-agents-projects-2
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials (see [Environment Setup](#-environment-setup))

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Setup

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (optional)
4. Get your config:
   - Go to Project Settings > General
   - Scroll to "Your apps" and select Web
   - Copy the Firebase configuration

Add to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Stripe Configuration

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Get your test API keys:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)

Add to `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
```

3. Set up webhook (for local testing):
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret and add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format
```

### Development Workflow

1. **Make changes** to files in `pages/`, `components/`, or `lib/`
2. **Test locally** at http://localhost:3000
3. **Run linter**: `npm run lint`
4. **Build**: `npm run build` to ensure no errors
5. **Commit** your changes

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Deploy!

3. **Configure Environment Variables** in Vercel Dashboard:

Go to Project Settings > Environment Variables and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

4. **Set up Stripe Webhook** for production:
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Copy the signing secret and add to Vercel environment variables

### Alternative Deployment Options

<details>
<summary>Deploy to Netlify</summary>

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables in Netlify dashboard
</details>

<details>
<summary>Deploy with Docker</summary>

```bash
# Build
docker build -t ai-agents-marketplace .

# Run
docker run -p 3000:3000 -e NEXT_PUBLIC_FIREBASE_API_KEY=... ai-agents-marketplace
```
</details>

## 📁 Project Structure

```
.
├── components/           # React components
│   ├── Auth/            # Authentication components
│   ├── AgentsCatalog.tsx
│   └── BuyButton.tsx
├── pages/               # Next.js pages
│   ├── api/            # API routes
│   │   ├── stripe/     # Stripe integration
│   │   ├── auth/       # Auth endpoints
│   │   └── user/       # User endpoints
│   ├── auth/           # Auth pages
│   ├── demo/           # Demo pages
│   └── index.tsx       # Homepage
├── lib/                # Utility libraries
│   ├── firebase.ts     # Firebase config
│   └── useAuth.ts      # Auth hook
├── styles/             # Global styles
├── docs/               # Documentation
├── demo/               # Demo hosting guides
├── public/             # Static assets
└── .github/
    └── workflows/      # CI/CD workflows
```

## ⚙️ Configuration

### Customizing Agents

Edit `components/AgentsCatalog.tsx` to add/modify agents:

```typescript
const PLACEHOLDER_AGENTS: Agent[] = [
  {
    id: 'agent-id',
    title: 'Agent Name',
    description: 'Description...',
    price: 99.99,
    demoLink: '/demo/agent-id',
    category: 'Category',
  },
  // Add more agents...
];
```

### Styling

- Global styles: `styles/globals.css`
- Tailwind config: `tailwind.config.js`
- Color scheme: Edit `primary` colors in Tailwind config

### Adding New Pages

1. Create file in `pages/` directory
2. Add routing automatically handled by Next.js
3. Link from other pages using `<Link>` component

## 📝 Next Steps

### Required Configuration (Before Going Live)

- [ ] Set up Firebase Authentication
  - [ ] Enable authentication methods
  - [ ] Configure authorized domains
- [ ] Configure Stripe
  - [ ] Add real products in Stripe Dashboard
  - [ ] Set up webhook endpoint
  - [ ] Test complete payment flow
- [ ] Deploy agent demos
  - [ ] Host on Gradio/Streamlit/HuggingFace
  - [ ] Update demo URLs in code
- [ ] Add real agent data
  - [ ] Replace placeholder agents
  - [ ] Add documentation for each agent
- [ ] Set up database (optional)
  - [ ] Store user purchases
  - [ ] Track agent usage
- [ ] Configure domain and SSL
  - [ ] Set up custom domain
  - [ ] Configure Firebase authorized domains
  - [ ] Update Stripe webhook URLs

### Recommended Enhancements

- [ ] Add user dashboard
- [ ] Implement agent access control
- [ ] Add purchase history
- [ ] Set up email notifications
- [ ] Add analytics (Google Analytics, Mixpanel)
- [ ] Implement search and filtering
- [ ] Add agent reviews and ratings
- [ ] Create admin panel
- [ ] Set up monitoring and error tracking (Sentry)
- [ ] Add more payment methods
- [ ] Implement subscription plans

## 📚 Documentation

- **Agent Documentation**: See `/docs/README.md`
- **Demo Hosting**: See `/demo/README.md`
- **API Routes**: Check `/pages/api/` for implementation
- **Original Project**: See `README_ORIGINAL.md` for the original project information

### Key Documentation Files

- [Agent Documentation Guide](/docs/README.md) - How to document agents
- [Demo Hosting Guide](/demo/README.md) - Deploy demos to Gradio/Streamlit/HuggingFace
- [Environment Variables](#-environment-setup) - Required configuration

## 🧪 Testing

### Test Stripe Payments

Use these test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

Any future expiration date and any 3-digit CVC.

### Test Firebase Auth

Create test accounts or use Google sign-in in development.

## 🐛 Troubleshooting

### Common Issues

**"Firebase not configured"**
- Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set in `.env.local`
- Verify Firebase project is created and Authentication is enabled

**"Stripe not configured"**
- Verify `STRIPE_SECRET_KEY` is set
- Check that key starts with `sk_test_` for test mode
- For webhooks, ensure `STRIPE_WEBHOOK_SECRET` is set

**Build errors**
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and `node_modules`, then reinstall
- Check for TypeScript errors: `npx tsc --noEmit`

**Demo iframe not loading**
- Update `demoUrl` in `pages/demo/[agent].tsx`
- Check CORS settings on demo host
- Verify iframe `sandbox` and `allow` attributes

## 🤝 Contributing

See [CONTRIBUTION.md](CONTRIBUTION.md) for contribution guidelines.

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Original Project**: [500+ AI Agents Projects](https://github.com/ashishpatel26/500-AI-Agents-Projects)
- **Firebase**: https://firebase.google.com/
- **Stripe**: https://stripe.com/
- **Next.js**: https://nextjs.org/
- **Tailwind CSS**: https://tailwindcss.com/

## 💬 Support

For issues and questions:
1. Check the [documentation](#-documentation)
2. Review [troubleshooting](#-troubleshooting)
3. Open an issue on GitHub
4. Check TODO comments in the code for implementation hints

---

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, Firebase, and Stripe.
