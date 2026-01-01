import React from 'react';

interface BuyButtonProps {
  agentId: string;
  agentName: string;
  price: number;
  disabled?: boolean;
}

export default function BuyButton({
  agentId,
  agentName,
  price,
  disabled = false,
}: BuyButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual Stripe publishable key in environment variables
      const response = await fetch('/api/stripe/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          agentName,
          price,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
        alert('Error creating checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating checkout session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={disabled || loading}
      className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : `Buy - $${price}`}
    </button>
  );
}
