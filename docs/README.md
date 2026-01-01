# AI Agents Documentation

Welcome to the AI Agents Platform documentation! This guide will help you understand how to add agents, configure demos, and set up pricing.

## Table of Contents

1. [Adding New Agents](#adding-new-agents)
2. [Setting Up Agent Demos](#setting-up-agent-demos)
3. [Configuring Pricing](#configuring-pricing)
4. [Documentation Structure](#documentation-structure)

## Adding New Agents

To add a new AI agent to the platform:

### 1. Update the Homepage Agent Catalog

Edit `pages/index.tsx` and add your agent to the `sampleAgents` array:

```typescript
const sampleAgents: Agent[] = [
  // ... existing agents
  {
    id: 'your-agent-id',
    title: 'Your Agent Title',
    description: 'Brief description of what your agent does',
    price: 199, // Price in USD
    demoLink: '/demo/your-agent-id',
    category: 'Your Category',
  },
];
```

### 2. Create Agent Documentation

Create a markdown file in the `docs/agents/` directory:

```bash
docs/agents/your-agent-id.md
```

Use the [Agent Documentation Template](./agent-template.md) as a starting point.

### 3. Configure Demo Page

Edit `pages/demo/[agent].tsx` and add your agent's demo configuration:

```typescript
const agentDemoInfo = {
  'your-agent-id': {
    title: 'Your Agent Title',
    description: 'Your agent description',
    embedUrl: 'https://your-demo-url.com', // Optional: Add after hosting demo
  },
};
```

See the [Demo Setup Guide](../demo/README.md) for hosting instructions.

## Setting Up Agent Demos

### Hosting Options

1. **Gradio on Hugging Face Spaces** (Recommended)
   - Free hosting for open-source demos
   - Easy integration with Python ML models
   - Get embed URL: `https://huggingface.co/spaces/username/space-name`

2. **Streamlit Cloud**
   - Free hosting for Streamlit apps
   - Great for data apps and dashboards
   - Get embed URL from deployment settings

3. **Custom Hosting**
   - Deploy on Vercel, Netlify, or your own server
   - Ensure CORS is configured for iframe embedding

### Embedding the Demo

Once hosted, add the embed URL to `pages/demo/[agent].tsx`:

```typescript
embedUrl: 'https://your-demo-url.com'
```

## Configuring Pricing

### Setting Agent Prices

Prices are set in the agent configuration (see "Adding New Agents" above). All prices are in USD.

### Stripe Configuration

1. Get your Stripe API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Add them to `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

3. Set up webhook endpoint:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events to listen for: `checkout.session.completed`, `payment_intent.succeeded`
   - Add webhook secret to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Documentation Structure

Organize your documentation as follows:

```
docs/
├── README.md (this file)
├── agent-template.md
├── agents/
│   ├── health-insights-agent.md
│   ├── automated-trading-bot.md
│   └── ... (one file per agent)
└── guides/
    ├── deployment.md
    ├── authentication.md
    └── customization.md
```

## Next Steps

1. Set up your Firebase configuration (see main README.md)
2. Configure Stripe for payments
3. Host your agent demos
4. Write detailed documentation for each agent
5. Deploy to Vercel

For deployment instructions, see the [main README.md](../README.md) in the repository root.
