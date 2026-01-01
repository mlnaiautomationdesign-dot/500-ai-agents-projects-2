import React from 'react';
import Link from 'next/link';
import BuyButton from './BuyButton';

export interface Agent {
  id: string;
  title: string;
  description: string;
  price: number;
  demoLink?: string;
  category: string;
}

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{agent.title}</h3>
          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
            {agent.category}
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary-600">${agent.price}</p>
          <p className="text-xs text-gray-500">one-time</p>
        </div>
      </div>
      <p className="text-gray-600 mb-6">{agent.description}</p>
      <div className="flex space-x-3">
        {agent.demoLink && (
          <Link
            href={`/demo/${agent.id}`}
            className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Try Demo
          </Link>
        )}
        <BuyButton agent={agent} className="flex-1" />
      </div>
    </div>
  );
}
