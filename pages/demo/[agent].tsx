import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AgentDemo() {
  const router = useRouter();
  const { agent } = router.query;

  // TODO: Replace this with actual agent data from your database or API
  const agentName = agent
    ? String(agent)
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Agent';

  // TODO: Replace with actual demo URL from your database
  // Examples:
  // - Gradio: https://your-space.hf.space
  // - Streamlit: https://your-app.streamlit.app
  // - HuggingFace: https://huggingface.co/spaces/username/space-name
  const demoUrl = `https://example.com/demo/${agent}`;

  return (
    <>
      <Head>
        <title>{agentName} Demo - AI Agents Marketplace</title>
        <meta
          name="description"
          content={`Try the ${agentName} interactive demo`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <span className="text-xl">←</span>
                <span className="font-medium">Back to Marketplace</span>
              </Link>
              <Link
                href="/"
                className="flex items-center space-x-2"
              >
                <span className="text-2xl">🤖</span>
                <span className="text-xl font-bold text-gray-900">
                  AI Agents Marketplace
                </span>
              </Link>
            </div>
          </nav>
        </header>

        {/* Demo Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {agentName} Demo
            </h1>
            <p className="text-gray-600">
              Try out the agent before purchasing. All features are available in the demo.
            </p>
          </div>

          {/* Demo Instructions (Remove when you have actual demos) */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Demo Configuration Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p className="mb-2">
                    To enable this demo, you need to:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>
                      Deploy your agent to Gradio, Streamlit, or HuggingFace Spaces
                    </li>
                    <li>
                      Update the <code className="bg-yellow-100 px-1 rounded">demoUrl</code> variable in this file with your demo URL
                    </li>
                    <li>
                      Remove or hide this instruction box
                    </li>
                  </ol>
                  <p className="mt-2">
                    See{' '}
                    <Link href="/demo/README.md" className="font-medium underline">
                      /demo/README.md
                    </Link>{' '}
                    for detailed instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Iframe Container */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Demo Active</span>
                </div>
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Open in new tab ↗
                </a>
              </div>
            </div>

            {/* TODO: Replace this with actual iframe when demo is deployed */}
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Demo Coming Soon
                </h3>
                <p className="text-gray-600 mb-4">
                  This agent demo will be available shortly. Please check back later or contact us for early access.
                </p>
                <Link
                  href="/"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Back to Marketplace
                </Link>
              </div>
            </div>

            {/* Uncomment this when you have actual demo URLs
            <iframe
              src={demoUrl}
              className="w-full h-[800px]"
              title={`${agentName} Demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
            */}
          </div>

          {/* Demo Information */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              About This Demo
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                This interactive demo allows you to test all features of the {agentName} before making a purchase.
              </p>
              <p>
                The demo environment includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Full access to all agent features</li>
                <li>Sample data for testing</li>
                <li>Real-time interaction</li>
                <li>No time limits or usage restrictions</li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">
                  Ready to get started?
                </p>
                <Link
                  href="/"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Purchase This Agent
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
            <p>&copy; 2024 AI Agents Marketplace. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
