import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

// TODO: Set this in your environment variables (.env.local)
// Get your webhook secret from: https://dashboard.stripe.com/test/webhooks
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Disable body parsing, need raw body for webhook signature verification
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

  if (!sig) {
    return res.status(400).json({ error: 'No signature found' });
  }

  if (!webhookSecret) {
    console.error(
      'STRIPE_WEBHOOK_SECRET is not set. Please add it to your .env.local file.'
    );
    return res.status(500).json({
      error: 'Webhook secret not configured',
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', session.id);

      // TODO: Fulfill the order
      // 1. Get agent ID from metadata
      const agentId = session.metadata?.agentId;
      // const userId = session.metadata?.userId;

      if (agentId) {
        // TODO: Grant access to the agent
        // Example:
        // await grantAgentAccess(userId, agentId);
        // await sendPurchaseConfirmationEmail(session.customer_email, agentId);
        console.log(`Granting access to agent ${agentId} for session ${session.id}`);
      }

      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment intent succeeded:', paymentIntent.id);
      // TODO: Handle successful payment
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', failedPayment.id);
      // TODO: Handle failed payment
      // Example: Send email notification to customer
      break;

    case 'charge.refunded':
      const refund = event.data.object as Stripe.Charge;
      console.log('Charge refunded:', refund.id);
      // TODO: Revoke agent access
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
}
