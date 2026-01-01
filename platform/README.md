# AI Agents SaaS Platform

A modern SaaS platform for discovering, purchasing, and deploying AI agents. Built with Next.js 14, TypeScript, Prisma, and Stripe.

## Features

- 🤖 **Extensive Agent Catalog** - Browse 500+ curated AI agents across multiple frameworks
- 🔐 **User Authentication** - Secure user registration and login with NextAuth.js
- 💳 **Stripe Integration** - Safe and reliable payment processing
- 📚 **Comprehensive Documentation** - Detailed guides for users and buyers
- 🎨 **Modern UI** - Beautiful, responsive interface built with Tailwind CSS
- 🔍 **Advanced Filtering** - Search agents by framework, industry, and category
- 🌐 **Live Demos** - Interactive showcases of AI functionality

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js v5
- **Database**: Prisma with SQLite (easily adaptable to PostgreSQL)
- **Payments**: Stripe
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2.git
cd 500-ai-agents-projects-2/platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and fill in your configuration:
- `DATABASE_URL` - Database connection string
- `NEXTAUTH_SECRET` - Random secret for NextAuth (run: `openssl rand -base64 32`)
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Seed the database with sample agents:
```bash
node scripts/seed.js
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The platform uses the following models:

- **User** - User accounts with authentication
- **Agent** - AI agent listings with metadata
- **Purchase** - Transaction records
- **Documentation** - Platform documentation pages
- **Session** - User session management

## Features in Detail

### Agent Catalog

Browse agents with advanced filtering:
- Filter by framework (CrewAI, AutoGen, Agno, LangGraph)
- Filter by industry (Healthcare, Finance, Education, etc.)
- Search by category
- Featured agents highlighting

### Authentication System

- Secure user registration with password hashing
- Email/password authentication
- Protected routes for purchases
- Session management

### Stripe Integration

- Secure checkout flow
- Payment intent creation
- Success/cancel handling
- Transaction tracking

### Documentation

Comprehensive guides covering:
- Getting started
- Authentication
- Browsing agents
- Purchasing workflow
- Integration guides
- Framework overviews
- FAQ and support

## Project Structure

```
platform/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── agents/       # Agent listing API
│   │   ├── auth/         # Authentication API
│   │   ├── register/     # User registration
│   │   └── stripe/       # Stripe payment API
│   ├── agents/           # Agents catalog page
│   ├── auth/             # Authentication pages
│   ├── docs/             # Documentation page
│   └── layout.tsx        # Root layout with navigation
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── stripe.ts         # Stripe client
│   └── utils.ts          # Helper functions
├── prisma/
│   └── schema.prisma     # Database schema
├── scripts/
│   └── seed.js           # Database seeding script
└── package.json
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands

- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `node scripts/seed.js` - Seed database with sample data

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `DATABASE_URL` - Production database URL (use PostgreSQL)
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Secure random secret
- `STRIPE_SECRET_KEY` - Live Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Live Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret (for production webhooks)

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoints for production:
   - Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
   - Events to listen: `checkout.session.completed`

## Contributing

Contributions are welcome! Please read the [CONTRIBUTION.md](../CONTRIBUTION.md) file for guidelines.

## Security

- Never commit `.env` file
- Use environment variables for all secrets
- Passwords are hashed with bcrypt
- Stripe handles all payment data (PCI compliant)
- HTTPS required for production

## License

MIT License - see [LICENSE](../LICENSE) file for details

## Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation at `/docs`
- Email: support@aiagents.com

## Roadmap

- [ ] Add demo/sandbox for agents
- [ ] Implement subscription model
- [ ] Add agent rating and reviews
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API access for developers
- [ ] Agent version management

## Acknowledgments

Built on top of the [500+ AI Agents Projects](https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2) repository.

