import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

/*
 * Stripe Checkout Session API Route
 * 
 * Creates a Stripe Checkout session for purchasing AI agents.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Get your Stripe Secret Key from https://dashboard.stripe.com/test/apikeys
 * 2. Add to .env.local: STRIPE_SECRET_KEY=sk_test_...
 * 3. Create products and prices in Stripe Dashboard
 * 4. Update priceIds in the frontend
 * 
 * TESTING:
 * - Use Stripe test mode keys (sk_test_...)
 * - Test cards: https://stripe.com/docs/testing
 * - Success card: 4242 4242 4242 4242
 * - Decline card: 4000 0000 0000 0002
 * 
 * TODO: Add user authentication validation
 * TODO: Add database integration to track purchases
 * TODO: Implement proper error logging
 */

// Initialize Stripe with secret key
// TODO: Add STRIPE_SECRET_KEY to your .env.local file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // TODO: Validate user authentication
  // Example: const userId = await getUserIdFromSession(req);
  // if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { priceId, agentName } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // Use 'payment' for one-time purchases
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // TODO: Update with your actual domain
      success_url: `${req.headers.origin || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}/?canceled=true`,
      // TODO: Add customer email and user ID metadata
      // customer_email: 'user@example.com',
      metadata: {
        agentName: agentName || 'Unknown Agent',
        // TODO: Add userId: userId,
      },
    });

    res.status(200).json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
