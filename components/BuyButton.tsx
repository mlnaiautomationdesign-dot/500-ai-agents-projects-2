import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Agent } from './AgentCard';

interface BuyButtonProps {
  agent: Agent;
  className?: string;
}

export default function BuyButton({ agent, className = '' }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleBuyClick = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call our API to create a Stripe Checkout session
      const response = await fetch('/api/stripe/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: agent.id,
          agentTitle: agent.title,
          price: agent.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleBuyClick}
        disabled={loading}
        className={`btn-primary disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? 'Processing...' : 'Buy Now'}
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </>
  );
}
