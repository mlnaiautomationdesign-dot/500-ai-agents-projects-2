# Agent Documentation Guide

This directory contains documentation for each AI agent available on the platform.

## Directory Structure

```
docs/
├── README.md                     # This file
├── agent-template.md             # Template for new agent docs
├── health-insights-agent.md      # Example agent documentation
├── trading-bot-agent.md          # Example agent documentation
└── ...                           # More agent docs
```

## Adding a New Agent

To add a new agent to the marketplace, follow these steps:

### 1. Create Agent Documentation

Copy `agent-template.md` and rename it to match your agent ID:

```bash
cp docs/agent-template.md docs/your-agent-id.md
```

Fill in all sections:
- **Overview**: What does the agent do?
- **Features**: Key capabilities and benefits
- **Use Cases**: When to use this agent
- **Pricing**: Monthly subscription cost
- **Demo**: Link to live demo
- **API Documentation**: How to integrate the agent
- **Requirements**: Any prerequisites or limitations
- **Support**: How to get help

### 2. Add Agent to Homepage

Edit `pages/index.tsx` and add your agent to the `PLACEHOLDER_AGENTS` array:

```typescript
{
  id: 'your-agent-id',
  title: 'Your Agent Name',
  description: 'Brief description (1-2 sentences)',
  price: 29.99,
  priceId: 'price_your_stripe_price_id', // From Stripe Dashboard
  demoUrl: '/demo/your-agent-id',
  category: 'Your Category',
  features: [
    'Feature 1',
    'Feature 2',
    'Feature 3',
    'Feature 4',
  ],
}
```

### 3. Create Demo Page

1. Host your demo on one of these platforms:
   - [Gradio](https://gradio.app/) - Python ML demos
   - [Streamlit](https://streamlit.io/) - Python data apps
   - [Hugging Face Spaces](https://huggingface.co/spaces) - ML model hosting

2. Update `pages/demo/[agent].tsx` with your demo URL:

```typescript
const DEMO_URLS: Record<string, string> = {
  'your-agent-id': 'https://your-demo-url.hf.space',
  // ... other agents
};
```

3. Add agent information:

```typescript
const AGENT_INFO: Record<string, { title: string; description: string }> = {
  'your-agent-id': {
    title: 'Your Agent Demo',
    description: 'Brief description of what users can try',
  },
  // ... other agents
};
```

### 4. Configure Stripe Product

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Click "Add Product"
3. Fill in:
   - **Name**: Your Agent Name
   - **Description**: Brief description
   - **Price**: Set monthly recurring price
4. Copy the **Price ID** (starts with `price_`)
5. Update your agent's `priceId` in `pages/index.tsx`

### 5. Test Locally

```bash
npm run dev
```

Visit:
- Homepage: http://localhost:3000
- Your agent demo: http://localhost:3000/demo/your-agent-id
- Test purchase flow (using Stripe test mode)

## Pricing Guidelines

- **Basic Agents**: $19.99 - $29.99/month
  - Simple automation tasks
  - Limited features
  - Standard support

- **Professional Agents**: $39.99 - $59.99/month
  - Advanced features
  - Multiple integrations
  - Priority support

- **Enterprise Agents**: $79.99+/month
  - Custom solutions
  - Unlimited usage
  - Dedicated support

## Best Practices

### Documentation

- Write clear, concise descriptions
- Include code examples for API integration
- Add screenshots or GIFs of the demo
- List all requirements and limitations
- Keep pricing transparent

### Demos

- Make demos interactive and engaging
- Use sample/placeholder data only
- Don't save user inputs from demos
- Show key features clearly
- Keep demo loading time under 10 seconds

### Pricing

- Be transparent about what's included
- Offer a free demo or trial period
- Consider tiered pricing for different use cases
- Include clear cancellation policy

## Agent Categories

Organize agents into these categories:

- **Healthcare** - Medical, health, wellness
- **Finance** - Trading, analysis, planning
- **Education** - Learning, tutoring, training
- **Business** - Automation, CRM, analytics
- **Marketing** - Content, SEO, social media
- **Development** - Code review, testing, deployment
- **Customer Service** - Support, chatbots, help desk
- **Creative** - Design, writing, media generation

## Support

For help adding agents:
- Check the [demo setup guide](../demo/README.md)
- Review existing agent documentation as examples
- Contact support at support@example.com

## TODO Checklist

When adding a new agent, ensure:

- [ ] Documentation file created and complete
- [ ] Agent added to homepage catalog
- [ ] Demo hosted and URL configured
- [ ] Stripe product and price created
- [ ] Price ID added to agent data
- [ ] Local testing completed
- [ ] Demo is responsive and loads quickly
- [ ] All links work correctly
- [ ] Documentation is clear and accurate
