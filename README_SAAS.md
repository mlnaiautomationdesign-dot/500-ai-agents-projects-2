# 🚀 AI Agents SaaS Marketplace

A modern, full-stack SaaS platform for discovering, demoing, and purchasing AI agents. Built with Next.js, TypeScript, Stripe, and Firebase.

## 🌟 Features

- **📱 Responsive marketplace** - Browse and discover AI agents across categories
- **🎮 Live demos** - Try agents before purchasing with embedded Gradio/Streamlit demos
- **💳 Stripe integration** - Secure payment processing with subscriptions
- **🔐 Firebase Authentication** - Email/password and Google Sign-In
- **⚡ Next.js 14** - Fast, SEO-friendly React framework
- **🎨 Tailwind CSS** - Modern, utility-first styling
- **📝 TypeScript** - Type-safe development
- **🔄 CI/CD** - Automated testing and deployment

## 🏗️ Project Structure

```
.
├── components/           # React components
│   ├── Auth/            # Authentication components
│   ├── AgentCard.tsx    # Agent display component
│   ├── BuyButton.tsx    # Stripe checkout button
│   └── Layout.tsx       # Page layout wrapper
├── hooks/               # Custom React hooks
│   └── useAuth.tsx      # Authentication hook and HOC
├── lib/                 # Utility libraries
│   └── firebase.ts      # Firebase client configuration
├── pages/               # Next.js pages
│   ├── api/            # API routes
│   │   ├── auth/       # Authentication endpoints
│   │   ├── stripe/     # Stripe integration
│   │   └── user/       # User data endpoints
│   ├── demo/           # Agent demo pages
│   │   └── [agent].tsx # Dynamic demo page
│   └── index.tsx       # Homepage with agents catalog
├── public/              # Static assets
├── styles/              # CSS styles
│   └── globals.css     # Global Tailwind styles
├── docs/                # Agent documentation
│   └── README.md       # Documentation guide
├── demo/                # Demo hosting guides
│   └── README.md       # Demo setup instructions
├── .github/
│   └── workflows/
│       └── ci.yml      # CI/CD pipeline
├── .env.example        # Environment variables template
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier works)
- Stripe account (test mode is sufficient)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 500-ai-agents-projects-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Firebase** (see [Firebase Setup](#firebase-setup))

5. **Configure Stripe** (see [Stripe Setup](#stripe-setup))

6. **Run development server**
   ```bash
   npm run dev
   ```

7. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### Firebase Setup

1. **Create a Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the wizard

2. **Get Firebase config**
   - In Project Settings > General > Your apps
   - Click "Web" (</> icon) to register app
   - Copy the configuration object

3. **Enable Authentication**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Enable "Google" (optional but recommended)
   - Add authorized domains (localhost, your production domain)

4. **Update `.env.local`**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### Stripe Setup

1. **Create a Stripe account**
   - Go to [Stripe](https://stripe.com)
   - Sign up for a free account

2. **Get API keys**
   - Go to [Dashboard > API Keys](https://dashboard.stripe.com/test/apikeys)
   - Copy your test mode keys (starts with `pk_test_` and `sk_test_`)

3. **Create products**
   - Go to [Dashboard > Products](https://dashboard.stripe.com/test/products)
   - Create a product for each agent
   - Add a recurring price (monthly subscription)
   - Copy the Price ID (starts with `price_`)

4. **Update `.env.local`**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   ```

5. **Set up webhooks** (for production)
   
   For local testing:
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe
   
   # Login
   stripe login
   
   # Forward webhooks
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   
   # Copy the webhook secret to .env.local
   STRIPE_WEBHOOK_SECRET=whsec_your_secret
   ```

## 📝 Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
npm run format:check # Check code formatting
npm run typecheck   # Run TypeScript type checking
```

## 🎯 Adding New Agents

See the comprehensive guides:
- [Agent Documentation Guide](docs/README.md) - How to document and add agents
- [Demo Hosting Guide](demo/README.md) - How to host and embed demos

Quick steps:

1. **Add agent data** to `pages/index.tsx`
2. **Create Stripe product** and get Price ID
3. **Host demo** on Gradio/Streamlit/Hugging Face
4. **Update demo URLs** in `pages/demo/[agent].tsx`
5. **Test locally** and deploy

## 🚢 Deployment

### Deploying to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Set environment variables**
   - In Vercel dashboard > Settings > Environment Variables
   - Add all variables from `.env.local`
   - Deploy!

### Deploying to Other Platforms

The app can be deployed to any platform that supports Next.js:
- **Netlify** - Configure build command: `npm run build`, publish directory: `.next`
- **AWS Amplify** - Auto-detects Next.js configuration
- **Digital Ocean App Platform** - Supports Next.js deployments
- **Self-hosted** - Run `npm run build && npm start`

## ✅ Post-Deployment Checklist

After deploying, complete these steps:

### Required

- [ ] Set all environment variables in production
- [ ] Add production domain to Firebase authorized domains
- [ ] Create Stripe webhook endpoint for production URL
- [ ] Update webhook secret in production environment
- [ ] Test authentication flow (email/password and Google)
- [ ] Test Stripe checkout flow with test card
- [ ] Verify demo iframes load correctly

### Recommended

- [ ] Set up custom domain
- [ ] Configure SSL/HTTPS
- [ ] Add real agent data (replace placeholders)
- [ ] Host and configure all agent demos
- [ ] Create real Stripe products and prices
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Add analytics (Google Analytics, Plausible, etc.)
- [ ] Configure email notifications
- [ ] Add terms of service and privacy policy
- [ ] Test on mobile devices

### Optional

- [ ] Set up Firebase Admin SDK for server-side auth
- [ ] Configure Firestore security rules
- [ ] Add user dashboard to view purchases
- [ ] Implement agent access control
- [ ] Set up automated backups
- [ ] Add more payment methods in Stripe
- [ ] Configure tax calculations with Stripe Tax
- [ ] Add customer support chat widget

## 🔒 Security Notes

- ✅ All secrets are in `.env.local` (not committed)
- ✅ Firebase config is public (by design, safe for client-side)
- ✅ Stripe webhook signatures are verified
- ✅ API routes validate inputs
- ⚠️ **Never commit** `.env.local` or real secrets
- ⚠️ **Always use** test mode keys during development
- ⚠️ **Review** Firebase security rules before production

## 🧪 Testing

### Test Stripe Checkout

Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry date and any 3-digit CVC

### Test Authentication

1. Create test account with email/password
2. Try Google Sign-In
3. Test protected pages (add with `withAuth` HOC)

### Test Webhooks Locally

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger payment_intent.succeeded
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🐛 Troubleshooting

### Build fails with "Firebase not configured"

This is a warning, not an error. The app works with placeholders for development. Configure Firebase to remove the warning.

### Stripe checkout not working

1. Check `STRIPE_SECRET_KEY` is set in `.env.local`
2. Verify the key starts with `sk_test_`
3. Ensure Price IDs are not placeholders
4. Check browser console for errors

### Demo not loading in iframe

1. Verify demo URL is accessible
2. Check if demo service (Gradio/Streamlit) is running
3. Look for X-Frame-Options or CORS issues
4. Test demo URL directly in browser

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Payments by [Stripe](https://stripe.com/)
- Authentication by [Firebase](https://firebase.google.com/)
- UI styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)

## 📞 Support

- 📧 Email: support@example.com
- 📚 Documentation: [docs/README.md](docs/README.md)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**Happy coding! 🚀**
