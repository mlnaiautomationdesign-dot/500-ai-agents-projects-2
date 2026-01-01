import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// TODO: Set this in your environment variables (.env.local)
// Get your test key from: https://dashboard.stripe.com/test/apikeys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // TODO: Add authentication check here
  // Example: const user = await getUser(req);
  // if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { agentId, agentName, price } = req.body;

    if (!agentId || !agentName || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error(
        'STRIPE_SECRET_KEY is not set. Please add it to your .env.local file.'
      );
      return res.status(500).json({
        error:
          'Stripe is not configured. Please contact support or set STRIPE_SECRET_KEY environment variable.',
      });
    }

    // TODO: Validate price against your database to prevent price manipulation
    // const agentData = await getAgentFromDatabase(agentId);
    // if (agentData.price !== price) throw new Error('Price mismatch');

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: agentName,
              description: `AI Agent: ${agentName}`,
              // TODO: Add agent images
              // images: ['https://your-domain.com/agent-images/${agentId}.png'],
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // TODO: Replace with your actual domain
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
      // TODO: Add customer email if user is logged in
      // customer_email: user.email,
      metadata: {
        agentId,
        // TODO: Add user ID when authentication is implemented
        // userId: user.id,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: 'Error creating checkout session',
      message: error.message,
    });
  }
}
