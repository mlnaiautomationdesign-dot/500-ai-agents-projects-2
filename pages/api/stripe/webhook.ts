import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

/*
 * Stripe Webhook Handler
 * 
 * Handles Stripe webhook events for payment processing.
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Get webhook secret from Stripe Dashboard:
 *    - Go to https://dashboard.stripe.com/test/webhooks
 *    - Click "Add endpoint"
 *    - URL: https://yourdomain.com/api/stripe/webhook
 *    - Events to listen: checkout.session.completed, customer.subscription.deleted, etc.
 * 
 * 2. Add to .env.local: STRIPE_WEBHOOK_SECRET=whsec_...
 * 
 * 3. For local testing with Stripe CLI:
 *    - Install: https://stripe.com/docs/stripe-cli
 *    - Login: stripe login
 *    - Forward webhooks: stripe listen --forward-to localhost:3000/api/stripe/webhook
 *    - Use the webhook secret from CLI output
 * 
 * IMPORTANT EVENTS TO HANDLE:
 * - checkout.session.completed: User completed payment
 * - customer.subscription.created: New subscription
 * - customer.subscription.updated: Subscription changed
 * - customer.subscription.deleted: Subscription canceled
 * - invoice.payment_succeeded: Recurring payment succeeded
 * - invoice.payment_failed: Recurring payment failed
 * 
 * TODO: Implement database updates for each event
 * TODO: Send confirmation emails
 * TODO: Provision/deprovision agent access
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Disable body parsing, need raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  // TODO: Add STRIPE_WEBHOOK_SECRET to .env.local
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('⚠️  Webhook secret not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  if (!sig) {
    return res.status(400).json({ error: 'No signature provided' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('💰 Checkout session completed:', session.id);
        
        // TODO: Update database with purchase
        // TODO: Send confirmation email
        // TODO: Grant access to purchased agent
        // Example:
        // await db.purchases.create({
        //   userId: session.metadata?.userId,
        //   agentName: session.metadata?.agentName,
        //   stripeSessionId: session.id,
        //   status: 'completed'
        // });
        
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('🎉 New subscription:', subscription.id);
        
        // TODO: Update database with subscription
        // TODO: Activate agent access
        
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('🔄 Subscription updated:', subscription.id);
        
        // TODO: Handle subscription changes (plan upgrade/downgrade)
        
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('❌ Subscription canceled:', subscription.id);
        
        // TODO: Revoke agent access
        // TODO: Send cancellation email
        
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('✅ Payment succeeded:', invoice.id);
        
        // TODO: Update payment records
        // TODO: Send receipt email
        
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('⚠️  Payment failed:', invoice.id);
        
        // TODO: Send payment failure notification
        // TODO: Implement retry logic or suspend access
        
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
