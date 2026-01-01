# 🚀 AI Agents SaaS Platform

A modern, production-ready SaaS platform for selling AI agents. Built with Next.js, TypeScript, Tailwind CSS, Firebase Authentication, and Stripe payments.

[![CI](https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2/actions/workflows/ci.yml/badge.svg)](https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2/actions/workflows/ci.yml)

## ✨ Features

- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🔐 **Authentication**: Firebase Auth with email/password and Google sign-in
- 💳 **Payments**: Stripe Checkout integration for one-time purchases
- 🤖 **Agent Marketplace**: Showcase and sell your AI agents
- 📊 **Demo Integration**: Embed Gradio, Streamlit, or custom demos
- 📱 **Mobile Responsive**: Works seamlessly on all devices
- 🛡️ **TypeScript**: Full type safety throughout the codebase
- 🚀 **Production Ready**: Optimized builds and CI/CD with GitHub Actions

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Firebase project ([Create one](https://console.firebase.google.com/))
- A Stripe account ([Sign up](https://dashboard.stripe.com/register))
- npm or yarn package manager

## 🏃 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2.git
cd 500-ai-agents-projects-2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```bash
# Firebase Configuration
# Get from: Firebase Console > Project Settings > General > Your apps
NEXT_PUBLIC_FIREBASE_CONFIG={"apiKey":"YOUR_API_KEY","authDomain":"YOUR_PROJECT.firebaseapp.com","projectId":"YOUR_PROJECT_ID","storageBucket":"YOUR_PROJECT.appspot.com","messagingSenderId":"YOUR_SENDER_ID","appId":"YOUR_APP_ID"}

# Stripe Configuration (Test Mode)
# Get from: https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY

# Stripe Webhook Secret (configure after deployment)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Firebase Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication > Sign-in methods > Email/Password and Google

2. **Get Configuration**:
   - Project Settings > General > Your apps
   - Add a Web app if you haven't already
   - Copy the Firebase configuration object

3. **Add to Environment**:
   - Paste the entire config object as JSON into `NEXT_PUBLIC_FIREBASE_CONFIG`

### Stripe Setup

1. **Get API Keys**:
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - Copy the Publishable key and Secret key (use test mode keys)
   - Add them to `.env.local`

2. **Set Up Webhook** (after deployment):
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook signing secret
   - Add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

## 📁 Project Structure

```
.
├── components/          # React components
│   ├── Auth/           # Authentication components
│   ├── AgentCard.tsx   # Agent card component
│   ├── BuyButton.tsx   # Stripe checkout button
│   └── Layout.tsx      # Main layout wrapper
├── lib/                # Utility libraries
│   ├── auth.tsx        # Auth context and hooks
│   └── firebase.ts     # Firebase configuration
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   │   ├── auth/      # Auth endpoints
│   │   ├── stripe/    # Stripe endpoints
│   │   └── user/      # User endpoints
│   ├── demo/          # Demo pages
│   ├── index.tsx      # Homepage
│   ├── login.tsx      # Login page
│   ├── register.tsx   # Registration page
│   └── success.tsx    # Purchase success page
├── styles/            # Global styles
├── docs/              # Documentation
├── demo/              # Demo hosting guides
└── .github/           # GitHub Actions workflows
```

## 🚢 Deployment

### Deploying to Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configure Environment Variables**:
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add all variables from `.env.local`
   - Redeploy after adding variables

4. **Update App URL**:
   - Change `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL
   - Update in both Vercel settings and `.env.local`

5. **Configure Stripe Webhook**:
   - Use your Vercel URL: `https://your-app.vercel.app/api/stripe/webhook`
   - Update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables

### Alternative Deployment Options

- **Netlify**: Similar to Vercel, great for Next.js
- **AWS Amplify**: Full AWS integration
- **Docker**: Use the included Dockerfile (if created)
- **Traditional VPS**: Deploy with PM2 or similar

## 📚 Documentation

- [Adding Agents](./docs/README.md#adding-new-agents)
- [Setting Up Demos](./demo/README.md)
- [API Documentation](./docs/README.md)
- [Agent Documentation Template](./docs/agent-template.md)

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
```

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ Stripe webhook signature verification
- ✅ Firebase authentication
- ✅ HTTPS required in production
- ⚠️ TODO: Add rate limiting for API routes
- ⚠️ TODO: Implement CSRF protection

## 🐛 Troubleshooting

### Firebase Configuration Issues

**Problem**: Firebase auth not working

**Solution**: 
- Verify `NEXT_PUBLIC_FIREBASE_CONFIG` is a valid JSON string
- Ensure Firebase Auth is enabled in Firebase Console
- Check browser console for detailed error messages

### Stripe Checkout Issues

**Problem**: Checkout session not creating

**Solution**:
- Verify `STRIPE_SECRET_KEY` starts with `sk_test_`
- Check Stripe Dashboard for API errors
- Ensure user is authenticated before checkout

### Build Failures

**Problem**: Build fails with TypeScript errors

**Solution**:
```bash
# Run type check locally
npm run type-check

# Fix reported errors
# Then rebuild
npm run build
```

## 📝 Next Steps After Setup

1. **Add Real Agent Data**: Update `pages/index.tsx` with your actual agents
2. **Host Demos**: Follow [demo/README.md](./demo/README.md) to host agent demos
3. **Customize Branding**: Update colors in `tailwind.config.js`
4. **Set Up Database**: Add a database (e.g., Firestore, PostgreSQL) for purchase records
5. **Implement Dashboard**: Create a user dashboard to manage purchased agents
6. **Add Email Notifications**: Integrate with SendGrid or similar for transactional emails
7. **Analytics**: Add Google Analytics or PostHog for user tracking
8. **Production Stripe Keys**: Switch from test keys to production keys when ready

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTION.md](./CONTRIBUTION.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check [docs/README.md](./docs/README.md)
- **Issues**: [GitHub Issues](https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2/discussions)

## 🌟 Original Content

The original AI agents use cases and projects can be found in [README_ORIGINAL.md](./README_ORIGINAL.md).

---

Built with ❤️ using Next.js, TypeScript, Firebase, and Stripe
