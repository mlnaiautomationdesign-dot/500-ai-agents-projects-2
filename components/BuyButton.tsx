import { useState } from 'react';

interface BuyButtonProps {
  priceId: string;
  agentName: string;
}

/*
 * BuyButton Component
 * 
 * Creates a Stripe Checkout session and redirects to Stripe's hosted checkout page.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local
 * 2. Create products and prices in Stripe Dashboard (test mode)
 * 3. Replace placeholder priceIds with real Stripe Price IDs
 * 4. Test with Stripe test card: 4242 4242 4242 4242
 * 
 * TODO: Add proper error handling and loading states
 * TODO: Add analytics tracking for purchase attempts
 */

export default function BuyButton({ priceId, agentName }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Add authentication check before allowing purchase
      // TODO: Implement proper user session management

      const response = await fetch('/api/stripe/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          agentName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionUrl } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = sessionUrl;
    } catch (err) {
      console.error('Purchase error:', err);
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePurchase}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md font-semibold transition ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        }`}
      >
        {loading ? 'Processing...' : 'Buy Now'}
      </button>
      {error && (
        <p className="text-red-600 text-xs mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
