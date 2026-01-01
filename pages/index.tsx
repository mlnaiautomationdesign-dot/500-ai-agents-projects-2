import Head from 'next/head';
import Layout from '@/components/Layout';
import AgentCard, { Agent } from '@/components/AgentCard';

// TODO: Replace with real agent data from database or CMS
const PLACEHOLDER_AGENTS: Agent[] = [
  {
    id: 'health-insights-agent',
    title: 'Health Insights Agent',
    description:
      'Analyzes medical reports and provides personalized health insights using advanced AI.',
    price: 29.99,
    priceId: 'price_health_insights', // TODO: Replace with real Stripe Price ID
    demoUrl: '/demo/health-insights-agent',
    category: 'Healthcare',
    features: [
      'Medical report analysis',
      'Personalized health recommendations',
      'HIPAA compliant',
      '24/7 AI support',
    ],
  },
  {
    id: 'trading-bot-agent',
    title: 'Automated Trading Bot',
    description:
      'Intelligent trading bot that analyzes market data and executes trades automatically.',
    price: 49.99,
    priceId: 'price_trading_bot', // TODO: Replace with real Stripe Price ID
    demoUrl: '/demo/trading-bot-agent',
    category: 'Finance',
    features: [
      'Real-time market analysis',
      'Automated trade execution',
      'Risk management',
      'Portfolio optimization',
    ],
  },
  {
    id: 'ai-tutor-agent',
    title: 'Virtual AI Tutor',
    description:
      'Personalized learning assistant that adapts to your learning style and pace.',
    price: 19.99,
    priceId: 'price_ai_tutor', // TODO: Replace with real Stripe Price ID
    demoUrl: '/demo/ai-tutor-agent',
    category: 'Education',
    features: [
      'Adaptive learning paths',
      'Interactive explanations',
      'Progress tracking',
      'Multi-subject support',
    ],
  },
  {
    id: 'customer-support-agent',
    title: 'Customer Support Agent',
    description:
      'AI-powered customer support that handles inquiries 24/7 with human-like responses.',
    price: 39.99,
    priceId: 'price_customer_support', // TODO: Replace with real Stripe Price ID
    demoUrl: '/demo/customer-support-agent',
    category: 'Business',
    features: [
      '24/7 availability',
      'Multi-language support',
      'Sentiment analysis',
      'Seamless handoff to humans',
    ],
  },
  {
    id: 'content-writer-agent',
    title: 'Content Writer Agent',
    description:
      'Generate high-quality content for blogs, social media, and marketing campaigns.',
    price: 24.99,
    priceId: 'price_content_writer', // TODO: Replace with real Stripe Price ID
    demoUrl: '/demo/content-writer-agent',
    category: 'Marketing',
    features: [
      'SEO-optimized content',
      'Multiple content formats',
      'Brand voice customization',
      'Plagiarism check',
    ],
  },
  {
    id: 'code-review-agent',
    title: 'Code Review Agent',
    description:
      'Automated code review agent that detects bugs, security issues, and suggests improvements.',
    price: 34.99,
    priceId: 'price_code_review', // TODO: Replace with real Stripe Price ID
    demoUrl: '/demo/code-review-agent',
    category: 'Development',
    features: [
      'Security vulnerability detection',
      'Code quality analysis',
      'Best practices suggestions',
      'Multi-language support',
    ],
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Agents Marketplace - Buy & Try AI Agents</title>
        <meta
          name="description"
          content="Discover and purchase powerful AI agents for healthcare, finance, education, and more."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                AI Agents for Every Need
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Discover, try, and buy powerful AI agents to automate your
                workflows
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#agents" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                  Browse Agents
                </a>
                <a href="/docs" className="btn-secondary">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Agents Catalog Section */}
        <section id="agents" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured AI Agents
              </h2>
              <p className="text-lg text-gray-600">
                Choose from our collection of specialized AI agents
              </p>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PLACEHOLDER_AGENTS.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Platform?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Access</h3>
                <p className="text-gray-600">
                  Try demos instantly and purchase with one click
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
                <p className="text-gray-600">
                  Enterprise-grade security with Stripe and Firebase
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Get help whenever you need it from our support team
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
