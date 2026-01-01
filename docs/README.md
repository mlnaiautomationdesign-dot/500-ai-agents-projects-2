# AI Agents Marketplace Documentation

Welcome to the AI Agents Marketplace documentation. This directory contains guides and documentation for working with AI agents.

## Contents

- [Adding Agent Documentation](#adding-agent-documentation)
- [Agent Demos](#agent-demos)
- [Pricing Configuration](#pricing-configuration)

## Adding Agent Documentation

To add documentation for a new AI agent:

1. Create a new markdown file in this directory: `docs/[agent-name].md`
2. Use the following template:

```markdown
# [Agent Name]

## Overview
Brief description of what this agent does and its main features.

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Use Cases
- Use case 1
- Use case 2
- Use case 3

## Requirements
List any prerequisites or requirements.

## Setup Instructions
1. Step 1
2. Step 2
3. Step 3

## Configuration
Details about configuration options.

## API Reference
If applicable, document the API endpoints and parameters.

## Examples
Provide code examples or usage scenarios.

## Pricing
- Base price: $X.XX
- Enterprise pricing available upon request

## Support
Contact information for support.
```

3. Add the agent to the catalog in `components/AgentsCatalog.tsx`

## Agent Demos

For information on setting up and hosting agent demos, see:
- [/demo/README.md](/demo/README.md) - Demo hosting guide
- [pages/demo/[agent].tsx](/pages/demo/[agent].tsx) - Demo page template

## Pricing Configuration

### Setting Up Agent Pricing

1. Define your pricing in the agent catalog (`components/AgentsCatalog.tsx`)
2. Ensure prices are synced with your Stripe product catalog
3. Update the checkout session creation logic in `pages/api/stripe/checkout_sessions.ts`

### Pricing Tiers

Consider offering multiple pricing tiers:
- **Basic**: Limited features, lower price point
- **Professional**: Full features for individuals
- **Enterprise**: Custom solutions with dedicated support

### Test Mode vs. Production

During development:
- Use Stripe test keys (starting with `pk_test_` and `sk_test_`)
- Test card: `4242 4242 4242 4242`

Before going live:
- Switch to production keys in environment variables
- Test the entire purchase flow
- Set up webhook endpoints in production

## Adding New Agents

To add a new agent to the marketplace:

1. **Create Documentation**: Add a markdown file in `/docs/[agent-name].md`
2. **Deploy Demo**: Host the demo on Gradio/Streamlit/HuggingFace (see `/demo/README.md`)
3. **Update Catalog**: Add the agent to `components/AgentsCatalog.tsx`:

```typescript
{
  id: 'agent-id',
  title: 'Agent Name',
  description: 'Brief description',
  price: 99.99,
  demoLink: '/demo/agent-id',
  category: 'Category',
}
```

4. **Configure Stripe**: Create a product in your Stripe dashboard
5. **Test**: Test the complete flow (demo → purchase → fulfillment)

## Best Practices

- Keep documentation up-to-date
- Include clear examples and use cases
- Provide troubleshooting guides
- Document all configuration options
- Include pricing information
- Add screenshots or demo videos when possible

## Contributing

When adding or updating documentation:
1. Follow the markdown template
2. Use clear, concise language
3. Include code examples where relevant
4. Test all links and references
5. Update the table of contents if needed
