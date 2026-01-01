import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import AgentCard, { Agent } from '@/components/AgentCard';

// TODO: Replace with real data from database or API
const sampleAgents: Agent[] = [
  {
    id: 'health-insights-agent',
    title: 'Health Insights Agent (HIA)',
    description: 'Analyzes medical reports and provides comprehensive health insights using advanced AI.',
    price: 99,
    demoLink: '/demo/health-insights-agent',
    category: 'Healthcare',
  },
  {
    id: 'automated-trading-bot',
    title: 'Automated Trading Bot',
    description: 'Automates stock trading with real-time market analysis and intelligent decision making.',
    price: 299,
    demoLink: '/demo/automated-trading-bot',
    category: 'Finance',
  },
  {
    id: 'virtual-ai-tutor',
    title: 'Virtual AI Tutor',
    description: 'Provides personalized education tailored to individual learning styles and pace.',
    price: 149,
    demoLink: '/demo/virtual-ai-tutor',
    category: 'Education',
  },
  {
    id: 'customer-support-chatbot',
    title: '24/7 AI Chatbot',
    description: 'Handles customer queries around the clock with intelligent responses and escalation.',
    price: 199,
    demoLink: '/demo/customer-support-chatbot',
    category: 'Customer Service',
  },
  {
    id: 'content-recommendation-agent',
    title: 'Content Personalization Agent',
    description: 'Recommends personalized media content based on user preferences and behavior.',
    price: 179,
    demoLink: '/demo/content-recommendation-agent',
    category: 'Entertainment',
  },
  {
    id: 'legal-document-assistant',
    title: 'Legal Document Review Assistant',
    description: 'Automates document review and highlights key clauses for legal professionals.',
    price: 249,
    demoLink: '/demo/legal-document-assistant',
    category: 'Legal',
  },
];

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>AI Agents Platform - Buy Premium AI Agents</title>
        <meta
          name="description"
          content="Discover and purchase premium AI agents for various industries"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
              Premium AI Agents Marketplace
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover and purchase production-ready AI agents for your business. Each agent is
              trained, tested, and ready to deploy.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Agents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sampleAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>

          <div className="bg-primary-600 rounded-lg p-8 text-center text-white mt-16">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Agent?</h2>
            <p className="text-lg mb-6">
              We can build a custom AI agent tailored to your specific business needs.
            </p>
            <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
