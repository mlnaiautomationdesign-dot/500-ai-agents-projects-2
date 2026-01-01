import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// TODO: Add your Stripe secret key to .env.local
// Get this from: https://dashboard.stripe.com/test/apikeys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { agentId, agentTitle, price } = req.body;

    if (!agentId || !agentTitle || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Verify user authentication here by checking session/JWT token
    // For now, we'll skip authentication check in the API route
    // You should implement proper authentication middleware

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: agentTitle,
              description: `Access to ${agentTitle} AI Agent`,
            },
            unit_amount: price * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?canceled=true`,
      metadata: {
        agentId,
        // TODO: Add userId here after implementing authentication
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout session error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
