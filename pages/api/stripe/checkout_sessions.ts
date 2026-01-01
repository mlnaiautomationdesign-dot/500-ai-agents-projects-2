import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

/**
 * Stripe Checkout Session Creation API
 * 
 * This endpoint creates a Stripe Checkout session for purchasing AI agents.
 * 
 * REQUIRED ENVIRONMENT VARIABLES:
 * - STRIPE_SECRET_KEY: Your Stripe secret key (starts with sk_test_ for test mode)
 * 
 * TODO: Configuration Steps
 * 1. Create a Stripe account at https://stripe.com
 * 2. Get your test mode secret key from https://dashboard.stripe.com/test/apikeys
 * 3. Create products and prices in Stripe Dashboard
 * 4. Add STRIPE_SECRET_KEY to .env.local
 * 5. Update the price IDs in the agent data
 * 
 * TEST MODE:
 * - Use test card: 4242 4242 4242 4242
 * - Any future expiry date
 * - Any 3-digit CVC
 */

// Initialize Stripe with secret key
// TODO: Set STRIPE_SECRET_KEY in .env.local
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

let stripe: Stripe | null = null;
if (stripeSecretKey && !stripeSecretKey.includes('your_')) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
  });
}

interface CheckoutRequestBody {
  agentId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Stripe is configured
  if (!stripe) {
    return res.status(500).json({
      error:
        'Stripe is not configured. Please set STRIPE_SECRET_KEY in .env.local',
    });
  }

  try {
    const { agentId, priceId, successUrl, cancelUrl } =
      req.body as CheckoutRequestBody;

    // Validate required fields
    if (!agentId || !priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({
        error: 'Missing required fields: agentId, priceId, successUrl, cancelUrl',
      });
    }

    // Check if using placeholder price ID
    if (priceId.includes('placeholder')) {
      return res.status(400).json({
        error:
          'Placeholder price ID detected. Please create products in Stripe Dashboard and update price IDs.',
        instructions: [
          '1. Go to https://dashboard.stripe.com/test/products',
          '2. Create a product for this agent',
          '3. Add a recurring or one-time price',
          '4. Copy the Price ID (starts with price_)',
          '5. Update the priceId in your agent data',
        ],
      });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Change to 'payment' for one-time purchases
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        agentId: agentId,
      },
      // Optional: Collect customer information
      customer_email: undefined, // TODO: Add user email if available
      // Optional: Allow promotion codes
      allow_promotion_codes: true,
      // Optional: Billing address collection
      billing_address_collection: 'auto',
    });

    return res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({
        error: error.message,
        type: error.type,
      });
    }

    return res.status(500).json({
      error: 'Failed to create checkout session',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
