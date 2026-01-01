import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';
import Link from 'next/link';

// TODO: Replace with real data from database or API
const agentDemoInfo: Record<
  string,
  { title: string; description: string; embedUrl?: string }
> = {
  'health-insights-agent': {
    title: 'Health Insights Agent (HIA)',
    description: 'Analyzes medical reports and provides comprehensive health insights.',
    embedUrl: '', // TODO: Add Gradio/Streamlit/HuggingFace Space URL
  },
  'automated-trading-bot': {
    title: 'Automated Trading Bot',
    description: 'Automates stock trading with real-time market analysis.',
    embedUrl: '',
  },
  'virtual-ai-tutor': {
    title: 'Virtual AI Tutor',
    description: 'Provides personalized education tailored to your needs.',
    embedUrl: '',
  },
  'customer-support-chatbot': {
    title: '24/7 AI Chatbot',
    description: 'Handles customer queries around the clock.',
    embedUrl: '',
  },
  'content-recommendation-agent': {
    title: 'Content Personalization Agent',
    description: 'Recommends personalized media content.',
    embedUrl: '',
  },
  'legal-document-assistant': {
    title: 'Legal Document Review Assistant',
    description: 'Automates document review and highlights key clauses.',
    embedUrl: '',
  },
};

export default function AgentDemo() {
  const router = useRouter();
  const { agent } = router.query;

  const agentId = typeof agent === 'string' ? agent : '';
  const agentInfo = agentDemoInfo[agentId];

  if (!agentInfo) {
    return (
      <Layout>
        <Head>
          <title>Demo Not Found - AI Agents Platform</title>
        </Head>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Demo Not Found</h1>
            <p className="text-gray-600 mb-8">
              The agent demo you're looking for doesn't exist.
            </p>
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{agentInfo.title} Demo - AI Agents Platform</title>
        <meta name="description" content={agentInfo.description} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Agents
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{agentInfo.title}</h1>
          <p className="text-lg text-gray-600">{agentInfo.description}</p>
        </div>

        {agentInfo.embedUrl ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <iframe
              src={agentInfo.embedUrl}
              className="w-full"
              style={{ height: '600px', border: 'none' }}
              title={`${agentInfo.title} Demo`}
            />
          </div>
        ) : (
          <div className="card bg-yellow-50 border-yellow-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Demo Setup Instructions</h2>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="mb-4">
                To embed a live demo for this agent, follow these steps:
              </p>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>
                  <strong>Host your demo on one of these platforms:</strong>
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>
                      <strong>Gradio:</strong> Deploy on Hugging Face Spaces (
                      <a
                        href="https://huggingface.co/spaces"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        huggingface.co/spaces
                      </a>
                      )
                    </li>
                    <li>
                      <strong>Streamlit:</strong> Deploy on Streamlit Cloud (
                      <a
                        href="https://streamlit.io/cloud"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        streamlit.io/cloud
                      </a>
                      )
                    </li>
                    <li>
                      <strong>Custom:</strong> Any service that provides an embeddable iframe URL
                    </li>
                  </ul>
                </li>
                <li className="mt-3">
                  <strong>Get the embed URL</strong> from your hosting platform
                </li>
                <li>
                  <strong>Update the embedUrl</strong> in{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    pages/demo/[agent].tsx
                  </code>{' '}
                  for the agent ID: <code className="bg-gray-100 px-2 py-1 rounded">{agentId}</code>
                </li>
              </ol>
              <div className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto mt-4">
                <pre>
                  <code>{`// In pages/demo/[agent].tsx
const agentDemoInfo = {
  '${agentId}': {
    title: '${agentInfo.title}',
    description: '${agentInfo.description}',
    embedUrl: 'https://your-demo-url.com', // Add your URL here
  },
};`}</code>
                </pre>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                See <code className="bg-gray-100 px-2 py-1 rounded">demo/README.md</code> for
                detailed hosting instructions.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
