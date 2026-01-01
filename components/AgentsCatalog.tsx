import React from 'react';
import Link from 'next/link';
import BuyButton from './BuyButton';

export interface Agent {
  id: string;
  title: string;
  description: string;
  price: number;
  demoLink: string;
  category: string;
}

// Placeholder agent data - Replace with actual data from your database or API
const PLACEHOLDER_AGENTS: Agent[] = [
  {
    id: 'health-insights-agent',
    title: 'Health Insights Agent (HIA)',
    description:
      'Analyzes medical reports and provides comprehensive health insights with AI-powered diagnostics.',
    price: 99.99,
    demoLink: '/demo/health-insights-agent',
    category: 'Healthcare',
  },
  {
    id: 'trading-bot',
    title: 'Automated Trading Bot',
    description:
      'Automates stock trading with real-time market analysis and intelligent decision-making.',
    price: 199.99,
    demoLink: '/demo/trading-bot',
    category: 'Finance',
  },
  {
    id: 'ai-tutor',
    title: 'Virtual AI Tutor',
    description:
      'Provides personalized education tailored to individual learning styles and pace.',
    price: 49.99,
    demoLink: '/demo/ai-tutor',
    category: 'Education',
  },
  {
    id: 'customer-support',
    title: '24/7 AI Chatbot',
    description:
      'Handles customer queries around the clock with intelligent conversational AI.',
    price: 79.99,
    demoLink: '/demo/customer-support',
    category: 'Customer Service',
  },
  {
    id: 'recruitment-agent',
    title: 'Recruitment Recommendation Agent',
    description:
      'Suggests best-fit candidates for job openings using advanced matching algorithms.',
    price: 149.99,
    demoLink: '/demo/recruitment-agent',
    category: 'Human Resources',
  },
  {
    id: 'travel-assistant',
    title: 'Virtual Travel Assistant',
    description:
      'Plans comprehensive travel itineraries based on your preferences and budget.',
    price: 29.99,
    demoLink: '/demo/travel-assistant',
    category: 'Hospitality',
  },
];

export default function AgentsCatalog() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          AI Agents Marketplace
        </h2>
        <p className="text-xl text-gray-600">
          Discover and deploy powerful AI agents for your business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PLACEHOLDER_AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-100 rounded-full">
                  {agent.category}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  ${agent.price}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {agent.title}
              </h3>

              <p className="text-gray-600 mb-6 line-clamp-3">
                {agent.description}
              </p>

              <div className="flex flex-col space-y-3">
                <Link
                  href={agent.demoLink}
                  className="text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Try Demo
                </Link>
                <BuyButton
                  agentId={agent.id}
                  agentName={agent.title}
                  price={agent.price}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Looking for custom AI agents?{' '}
          <a href="#contact" className="text-primary-600 hover:text-primary-700 font-semibold">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
