import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AgentsCatalog from '@/components/AgentsCatalog';

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Agents Marketplace - 500+ AI Agents Projects</title>
        <meta
          name="description"
          content="Discover, purchase, and deploy powerful AI agents for your business. Access 500+ AI agent projects across healthcare, finance, education, and more."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🤖</span>
                <span className="text-xl font-bold text-gray-900">
                  AI Agents Marketplace
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/docs"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Docs
                </Link>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Deploy Powerful AI Agents
                <br />
                <span className="text-primary-600">For Your Business</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Access 500+ pre-built AI agents across industries. From
                healthcare to finance, education to customer service - find the
                perfect AI solution for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#catalog"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg"
                >
                  Browse Agents
                </a>
                <Link
                  href="/docs"
                  className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-8 rounded-lg border-2 border-gray-200 transition-colors text-lg"
                >
                  View Documentation
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our AI Agents?
              </h2>
              <p className="text-lg text-gray-600">
                Built with cutting-edge technology and industry best practices
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Quick Deployment
                </h3>
                <p className="text-gray-600">
                  Get your AI agent up and running in minutes with our
                  streamlined setup process
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Secure & Reliable
                </h3>
                <p className="text-gray-600">
                  Enterprise-grade security with 99.9% uptime guarantee for all
                  agents
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Fully Customizable
                </h3>
                <p className="text-gray-600">
                  Tailor each agent to your specific needs with extensive
                  configuration options
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Agents Catalog */}
        <section id="catalog" className="bg-gray-50 py-20">
          <AgentsCatalog />
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h4 className="font-bold text-lg mb-4">AI Agents Marketplace</h4>
                <p className="text-gray-400">
                  Your destination for powerful, pre-built AI agents
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#catalog" className="hover:text-white">
                      Browse Agents
                    </a>
                  </li>
                  <li>
                    <Link href="/docs" className="hover:text-white">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <a href="#pricing" className="hover:text-white">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#about" className="hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="hover:text-white">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#blog" className="hover:text-white">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#privacy" className="hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#terms" className="hover:text-white">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 AI Agents Marketplace. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
