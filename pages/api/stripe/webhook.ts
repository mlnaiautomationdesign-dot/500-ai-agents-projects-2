import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

/**
 * Stripe Webhook Handler
 * 
 * This endpoint receives and processes webhook events from Stripe.
 * Webhooks are used to handle asynchronous events like successful payments,
 * subscription updates, and payment failures.
 * 
 * REQUIRED ENVIRONMENT VARIABLES:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Your webhook signing secret (starts with whsec_)
 * 
 * TODO: Configuration Steps
 * 
 * LOCAL TESTING with Stripe CLI:
 * 1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
 * 2. Login: stripe login
 * 3. Forward webhooks to local server:
 *    stripe listen --forward-to localhost:3000/api/stripe/webhook
 * 4. Copy the webhook signing secret (whsec_...) to STRIPE_WEBHOOK_SECRET
 * 5. Trigger test events: stripe trigger payment_intent.succeeded
 * 
 * PRODUCTION SETUP:
 * 1. Go to https://dashboard.stripe.com/webhooks
 * 2. Add endpoint: https://your-domain.com/api/stripe/webhook
 * 3. Select events to listen for (recommended: checkout.session.completed, customer.subscription.updated, etc.)
 * 4. Copy the signing secret to your production environment variables
 * 
 * IMPORTANT: This route requires raw body for signature verification
 */

// Disable body parsing for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

let stripe: Stripe | null = null;
if (stripeSecretKey && !stripeSecretKey.includes('your_')) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
  });
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
      error: 'Stripe is not configured',
    });
  }

  if (!webhookSecret || webhookSecret.includes('your_')) {
    console.warn('STRIPE_WEBHOOK_SECRET not configured - webhook signature verification disabled');
    return res.status(500).json({
      error: 'Webhook secret not configured',
    });
  }

  try {
    // Get raw body for signature verification
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    // Verify webhook signature and construct event
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).json({
        error: `Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      });
    }

    // Handle different event types
    console.log(`Received webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        
        // TODO: Implement your business logic here
        // Examples:
        // - Grant access to the purchased agent
        // - Send confirmation email
        // - Update database with purchase record
        // - Create user account if new customer
        
        const agentId = session.metadata?.agentId;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        
        console.log('Agent purchased:', {
          agentId,
          customerId,
          subscriptionId,
        });
        
        // TODO: Store purchase in your database
        // await database.purchases.create({
        //   userId: customerId,
        //   agentId: agentId,
        //   subscriptionId: subscriptionId,
        //   status: 'active',
        // });
        
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.id);
        
        // TODO: Handle subscription updates
        // Examples:
        // - Update subscription status in database
        // - Handle plan changes
        // - Send notification to customer
        
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription cancelled:', subscription.id);
        
        // TODO: Revoke access to agent
        // - Update database to mark subscription as cancelled
        // - Disable agent access for user
        // - Send cancellation confirmation email
        
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment succeeded:', invoice.id);
        
        // TODO: Handle successful payment
        // - Extend subscription period
        // - Send receipt email
        
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment failed:', invoice.id);
        
        // TODO: Handle failed payment
        // - Send payment failure notification
        // - Potentially suspend access after retry attempts
        
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success response to Stripe
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({
      error: 'Webhook handler failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
