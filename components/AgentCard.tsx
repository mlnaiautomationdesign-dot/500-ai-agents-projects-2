import Link from 'next/link';
import BuyButton from './BuyButton';

export interface Agent {
  id: string;
  title: string;
  description: string;
  price: number;
  priceId?: string; // Stripe Price ID - TODO: Add real Stripe Price IDs
  demoUrl: string;
  category: string;
  features: string[];
}

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col h-full">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-100 rounded-full">
            {agent.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {agent.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 flex-grow">{agent.description}</p>

        {/* Features */}
        <ul className="mb-4 space-y-1">
          {agent.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex items-start">
              <svg
                className="w-4 h-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="text-3xl font-bold text-gray-900 mb-4">
          ${agent.price}
          <span className="text-sm font-normal text-gray-600">/month</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <BuyButton agent={agent} />
          <Link
            href={`/demo/${agent.id}`}
            className="text-center px-6 py-2 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-200"
          >
            Try Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
