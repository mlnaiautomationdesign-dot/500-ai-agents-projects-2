import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// TODO: Add your Stripe webhook secret to .env.local as STRIPE_WEBHOOK_SECRET
// Get this from: https://dashboard.stripe.com/test/webhooks
// After creating a webhook endpoint pointing to: https://your-domain.com/api/stripe/webhook
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// Disable body parsing, need raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to get raw body
async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const buf = await getRawBody(req);
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).json({ error: "Missing stripe-signature header" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).json({
      error: "Webhook signature verification failed",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session completed:", session.id);

        // TODO: Fulfill the purchase
        // - Save subscription to database
        // - Send confirmation email
        // - Grant access to the agent
        // - Update user's subscription status
        console.log("Agent ID:", session.metadata?.agentId);
        console.log("Customer:", session.customer);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription created:", subscription.id);

        // TODO: Handle new subscription
        // - Update database with subscription details
        // - Activate user access
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", subscription.id);

        // TODO: Handle subscription updates
        // - Update subscription status in database
        // - Handle plan changes
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription cancelled:", subscription.id);

        // TODO: Handle subscription cancellation
        // - Revoke access to agent
        // - Update database
        // - Send cancellation email
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Invoice payment succeeded:", invoice.id);

        // TODO: Handle successful payment
        // - Send receipt email
        // - Extend subscription period
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Invoice payment failed:", invoice.id);

        // TODO: Handle failed payment
        // - Send payment failed email
        // - Notify user to update payment method
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error handling webhook event:", error);
    res.status(500).json({
      error: "Webhook handler failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
