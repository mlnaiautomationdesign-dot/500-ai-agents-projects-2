import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

// Placeholder agent data
const placeholderAgents = [
  {
    id: "health-assistant",
    title: "AI Health Assistant",
    description:
      "Diagnoses and monitors diseases using patient data. Perfect for healthcare professionals.",
    price: "$99/month",
    demoLink: "/demo/health-assistant",
  },
  {
    id: "trading-bot",
    title: "Automated Trading Bot",
    description:
      "Automates stock trading with real-time market analysis. Maximize your returns.",
    price: "$199/month",
    demoLink: "/demo/trading-bot",
  },
  {
    id: "virtual-tutor",
    title: "Virtual AI Tutor",
    description:
      "Provides personalized education tailored to users. Learn at your own pace.",
    price: "$49/month",
    demoLink: "/demo/virtual-tutor",
  },
  {
    id: "customer-support",
    title: "24/7 AI Chatbot",
    description:
      "Handles customer queries around the clock. Never miss a customer interaction.",
    price: "$149/month",
    demoLink: "/demo/customer-support",
  },
  {
    id: "content-writer",
    title: "AI Content Writer",
    description:
      "Generate high-quality content for blogs, social media, and marketing.",
    price: "$79/month",
    demoLink: "/demo/content-writer",
  },
  {
    id: "code-assistant",
    title: "AI Code Assistant",
    description:
      "Helps developers write better code faster with intelligent suggestions.",
    price: "$129/month",
    demoLink: "/demo/code-assistant",
  },
];

interface BuyButtonProps {
  agentId: string;
  price: string;
}

function BuyButton({ agentId, price }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual Stripe checkout session creation
      const response = await fetch("/api/stripe/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId,
          price,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to initiate checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Loading..." : "Buy Now"}
    </button>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Agents Marketplace - Your AI Solutions Hub</title>
        <meta
          name="description"
          content="Discover and purchase powerful AI agents for your business needs"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Agents Marketplace
                </h1>
                <p className="text-gray-600 mt-1">
                  500+ AI Agent Projects & Solutions
                </p>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
              Transform Your Business with
              <span className="text-blue-600"> AI Agents</span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our curated collection of AI agents designed to automate,
              optimize, and revolutionize your workflows. Try demos before you
              buy!
            </p>
          </div>
        </section>

        {/* Agents Catalog */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            Featured AI Agents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeholderAgents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {agent.title}
                  </h4>
                  <p className="text-gray-600 mb-4 h-20">{agent.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {agent.price}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={agent.demoLink}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg text-center transition-colors"
                    >
                      Try Demo
                    </Link>
                    <BuyButton agentId={agent.id} price={agent.price} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h5 className="text-lg font-semibold mb-4">
                  AI Agents Marketplace
                </h5>
                <p className="text-gray-400">
                  Your trusted source for AI agent solutions across all
                  industries.
                </p>
              </div>
              <div>
                <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/docs" className="hover:text-white">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/demo" className="hover:text-white">
                      Demos
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="hover:text-white">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-lg font-semibold mb-4">Support</h5>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="mailto:support@aiagents.com" className="hover:text-white">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <Link href="/docs" className="hover:text-white">
                      Help Center
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>
                &copy; 2024 AI Agents Marketplace. All rights reserved. Powered
                by Next.js, Stripe, and Firebase.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
