import { useState } from 'react';
import { Agent } from './AgentCard';

interface BuyButtonProps {
  agent: Agent;
}

export default function BuyButton({ agent }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    // TODO: Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!stripePublishableKey || stripePublishableKey.includes('your_')) {
      alert(
        'Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local'
      );
      return;
    }

    setLoading(true);

    try {
      // Call our API to create a checkout session
      const response = await fetch('/api/stripe/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: agent.id,
          priceId: agent.priceId || 'price_placeholder', // TODO: Add real Stripe Price ID
          successUrl: `${window.location.origin}/success?agent=${agent.id}`,
          cancelUrl: `${window.location.origin}/?canceled=true`,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
        setLoading(false);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className="btn-primary w-full"
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : (
        'Buy Now'
      )}
    </button>
  );
}
