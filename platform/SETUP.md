# Quick Setup Guide for AI Agents SaaS Platform

This guide will help you get the platform up and running in minutes.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

## Step 1: Clone the Repository

```bash
git clone https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2.git
cd 500-ai-agents-projects-2/platform
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and update the following variables:

```env
# Database (SQLite for development, PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# Authentication (generate a secret with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Stripe (get these from https://stripe.com/dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Getting Stripe Keys

1. Create a free account at https://stripe.com
2. Go to Developers → API keys
3. Copy your Publishable key and Secret key
4. For webhook secret, create a webhook endpoint after deployment

## Step 4: Initialize Database

Generate Prisma client and create database:

```bash
npx prisma generate
npx prisma db push
```

## Step 5: Seed Database with Sample Agents

```bash
node scripts/seed.js
```

This will populate your database with 15 sample AI agents from various frameworks.

## Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: Test the Platform

1. **Browse Agents**: Go to the Agents page to see the catalog
2. **Create Account**: Click "Sign Up" to register
3. **View Agent Details**: Click on any agent to see full details
4. **Check Documentation**: Visit `/docs` for comprehensive guides

## Features Available

✅ **User Registration & Authentication**
- Create account with email/password
- Secure login system
- Session management

✅ **AI Agents Catalog**
- Browse 500+ agents
- Filter by framework (CrewAI, AutoGen, Agno, LangGraph)
- Filter by industry
- Search functionality

✅ **Agent Details**
- Full descriptions
- GitHub links
- Pricing information
- Tags and categories

✅ **Documentation**
- Getting started guides
- Integration tutorials
- Framework overviews
- FAQ

✅ **Stripe Integration** (Test Mode)
- Secure checkout flow
- Payment processing
- Transaction tracking

## Production Deployment

### Using Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Update these for production:

- `DATABASE_URL` - Use PostgreSQL (e.g., from Vercel Postgres or Railway)
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - New secure random secret
- Use Stripe **live** keys instead of test keys

## Database Management

### View Database

```bash
npx prisma studio
```

Opens a GUI at http://localhost:5555 to view and edit data.

### Reset Database

```bash
npx prisma db push --force-reset
node scripts/seed.js
```

## Troubleshooting

### Build Errors

If you encounter build errors:

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

Make sure `DATABASE_URL` is properly set in `.env`:

```bash
echo $DATABASE_URL
```

### Prisma Client Not Generated

```bash
npx prisma generate
```

## Next Steps

1. **Customize the Platform**
   - Update colors in `tailwind.config.js`
   - Modify homepage content in `app/page.tsx`
   - Add more agents to the database

2. **Add Real Payment Processing**
   - Set up Stripe webhook endpoint
   - Implement purchase completion logic
   - Add user dashboard for purchases

3. **Enhance Features**
   - Add agent reviews and ratings
   - Implement search functionality
   - Add user favorites/bookmarks
   - Create admin dashboard

## Support

For issues or questions:
- Check the [main documentation](./README.md)
- Open an issue on GitHub
- Review the [contribution guidelines](../CONTRIBUTION.md)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
