import Link from 'next/link'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-gray-600">
            Learn how to use the AI Agents SaaS platform and integrate agents into your projects.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="font-semibold mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                <a href="#getting-started" className="block text-blue-600 hover:underline">
                  Getting Started
                </a>
                <a href="#authentication" className="block text-gray-600 hover:text-blue-600 hover:underline">
                  Authentication
                </a>
                <a href="#browsing-agents" className="block text-gray-600 hover:text-blue-600 hover:underline">
                  Browsing Agents
                </a>
                <a href="#purchasing" className="block text-gray-600 hover:text-blue-600 hover:underline">
                  Purchasing Agents
                </a>
                <a href="#integration" className="block text-gray-600 hover:text-blue-600 hover:underline">
                  Integration Guide
                </a>
                <a href="#frameworks" className="block text-gray-600 hover:text-blue-600 hover:underline">
                  Frameworks Overview
                </a>
                <a href="#support" className="block text-gray-600 hover:text-blue-600 hover:underline">
                  Support & FAQ
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
              <section id="getting-started">
                <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
                <p className="text-gray-700 mb-4">
                  Welcome to the 500+ AI Agents Marketplace! This platform provides access to a 
                  comprehensive collection of AI agents across various frameworks and industries.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
                  <p className="font-semibold text-blue-900 mb-2">Quick Start</p>
                  <ol className="list-decimal list-inside space-y-2 text-blue-800">
                    <li>Create an account or sign in</li>
                    <li>Browse the agents catalog</li>
                    <li>Select an agent that fits your needs</li>
                    <li>Complete the purchase via Stripe</li>
                    <li>Access the agent code and documentation</li>
                  </ol>
                </div>
              </section>

              <section id="authentication">
                <h2 className="text-2xl font-bold mb-4">Authentication</h2>
                <p className="text-gray-700 mb-4">
                  To access premium features and purchase agents, you need to create an account.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Creating an Account</h3>
                    <p className="text-gray-600">
                      Navigate to the <Link href="/auth/register" className="text-blue-600 hover:underline">registration page</Link> and 
                      provide your email, name, and password. Your password must be at least 8 characters long.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Signing In</h3>
                    <p className="text-gray-600">
                      Use your registered email and password on the <Link href="/auth/signin" className="text-blue-600 hover:underline">sign in page</Link>.
                    </p>
                  </div>
                </div>
              </section>

              <section id="browsing-agents">
                <h2 className="text-2xl font-bold mb-4">Browsing Agents</h2>
                <p className="text-gray-700 mb-4">
                  Our catalog features 500+ AI agents organized by:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                  <li><strong>Framework:</strong> CrewAI, AutoGen, Agno, LangGraph</li>
                  <li><strong>Industry:</strong> Healthcare, Finance, Education, E-commerce, etc.</li>
                  <li><strong>Category:</strong> Customer Service, Productivity, Analytics, etc.</li>
                </ul>
                <p className="text-gray-600">
                  Use the filter options on the <Link href="/agents" className="text-blue-600 hover:underline">agents page</Link> to 
                  narrow down your search.
                </p>
              </section>

              <section id="purchasing">
                <h2 className="text-2xl font-bold mb-4">Purchasing Agents</h2>
                <p className="text-gray-700 mb-4">
                  We use Stripe for secure payment processing. Here&apos;s how purchasing works:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
                  <li>Sign in to your account</li>
                  <li>Select an agent and click &quot;Purchase&quot;</li>
                  <li>You&apos;ll be redirected to Stripe&apos;s secure checkout</li>
                  <li>Complete payment with your credit card</li>
                  <li>Get instant access to the agent code and documentation</li>
                </ol>
                <div className="bg-green-50 border-l-4 border-green-600 p-4">
                  <p className="text-green-800">
                    <strong>Secure Payments:</strong> All transactions are processed securely through Stripe. 
                    We never store your payment information.
                  </p>
                </div>
              </section>

              <section id="integration">
                <h2 className="text-2xl font-bold mb-4">Integration Guide</h2>
                <p className="text-gray-700 mb-4">
                  After purchasing an agent, you&apos;ll receive:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                  <li>Complete source code with comments</li>
                  <li>Installation instructions and requirements</li>
                  <li>Configuration examples and environment setup</li>
                  <li>Usage examples and API documentation</li>
                  <li>Links to the original GitHub repository</li>
                </ul>
              </section>

              <section id="frameworks">
                <h2 className="text-2xl font-bold mb-4">Frameworks Overview</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-semibold mb-2">CrewAI</h3>
                    <p className="text-gray-600">
                      Framework for orchestrating role-playing, autonomous AI agents. Great for 
                      collaborative multi-agent workflows.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-600 pl-4">
                    <h3 className="font-semibold mb-2">AutoGen</h3>
                    <p className="text-gray-600">
                      Microsoft&apos;s framework for building multi-agent conversational systems with 
                      code generation and execution capabilities.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h3 className="font-semibold mb-2">Agno</h3>
                    <p className="text-gray-600">
                      Modern framework for building intelligent agents with built-in tools and 
                      knowledge management.
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-600 pl-4">
                    <h3 className="font-semibold mb-2">LangGraph</h3>
                    <p className="text-gray-600">
                      Build stateful, multi-actor applications with LLMs using graph-based workflows.
                    </p>
                  </div>
                </div>
              </section>

              <section id="support">
                <h2 className="text-2xl font-bold mb-4">Support & FAQ</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">How do I get support?</h3>
                    <p className="text-gray-600">
                      For technical issues, refer to the individual agent&apos;s GitHub repository. 
                      For platform-related questions, contact us at support@aiagents.com.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Can I request refunds?</h3>
                    <p className="text-gray-600">
                      We offer refunds within 30 days of purchase if the agent doesn&apos;t meet the 
                      described functionality.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Do agents receive updates?</h3>
                    <p className="text-gray-600">
                      Yes, purchased agents receive updates automatically through their GitHub 
                      repositories.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Can I contribute agents?</h3>
                    <p className="text-gray-600">
                      Absolutely! Check our <a href="https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2/blob/main/CONTRIBUTION.md" className="text-blue-600 hover:underline">contribution guidelines</a> for 
                      details on submitting your AI agent projects.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
