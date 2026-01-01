import Head from 'next/head';
import Link from 'next/link';
import BuyButton from '@/components/BuyButton';

// TODO: Replace with real agent data from database or CMS
const placeholderAgents = [
  {
    id: 'health-insights-agent',
    title: 'Health Insights Agent',
    description:
      'Analyzes medical reports and provides personalized health insights using advanced AI.',
    price: 29.99,
    priceId: 'price_PLACEHOLDER_HIA',
  },
  {
    id: 'trading-bot-agent',
    title: 'Automated Trading Bot',
    description:
      'Real-time market analysis and automated trading with risk management.',
    price: 49.99,
    priceId: 'price_PLACEHOLDER_TRADING',
  },
  {
    id: 'ai-tutor-agent',
    title: 'Virtual AI Tutor',
    description:
      'Personalized education with adaptive learning paths and instant feedback.',
    price: 19.99,
    priceId: 'price_PLACEHOLDER_TUTOR',
  },
  {
    id: 'customer-support-agent',
    title: 'Customer Support Agent',
    description:
      '24/7 intelligent customer support with multi-language capabilities.',
    price: 39.99,
    priceId: 'price_PLACEHOLDER_SUPPORT',
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Agents SaaS Platform</title>
        <meta
          name="description"
          content="Discover and purchase powerful AI agents for your business"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                🤖 AI Agents Marketplace
              </h1>
              <nav className="space-x-4">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Browse
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Docs
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Sign In
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
            Empower Your Business with AI Agents
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover, try, and deploy production-ready AI agents. From health
            analytics to trading bots – find the perfect agent for your needs.
          </p>
        </section>

        {/* Agents Catalog */}
        <section className="container mx-auto px-4 pb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured AI Agents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {placeholderAgents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {agent.title}
                </h4>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                  {agent.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary-600">
                    ${agent.price}
                  </span>
                  <span className="text-sm text-gray-500">/month</span>
                </div>
                <div className="space-y-2">
                  <Link
                    href={`/demo/${agent.id}`}
                    className="block w-full text-center py-2 px-4 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition"
                  >
                    Try Demo
                  </Link>
                  <BuyButton
                    priceId={agent.priceId}
                    agentName={agent.title}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              © 2024 AI Agents Marketplace. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Built with Next.js, Stripe, and Firebase
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
