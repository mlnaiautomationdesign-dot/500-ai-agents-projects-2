import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

/*
 * Demo Page Template
 * 
 * This page displays an embedded demo of an AI agent using an iframe.
 * 
 * TODO: Update iframe URLs with actual Gradio/Streamlit/HuggingFace Space URLs
 * 
 * INSTRUCTIONS FOR EMBEDDING DEMOS:
 * 
 * 1. Gradio Apps:
 *    - Deploy your Gradio app to Hugging Face Spaces
 *    - Use URL format: https://huggingface.co/spaces/USERNAME/SPACE_NAME
 *    - Enable iframe embedding in Space settings
 * 
 * 2. Streamlit Apps:
 *    - Deploy to Streamlit Cloud or custom server
 *    - Use URL format: https://APPNAME.streamlit.app
 *    - Configure CORS if needed
 * 
 * 3. HuggingFace Spaces:
 *    - Direct space URL: https://huggingface.co/spaces/USERNAME/SPACE_NAME
 *    - Embed parameter: ?embed=true
 * 
 * 4. Security Considerations:
 *    - Add Content-Security-Policy headers in next.config.js
 *    - Validate iframe sources
 *    - Consider using postMessage API for cross-frame communication
 */

// TODO: Move to database or configuration file
const demoUrls: Record<string, string> = {
  'health-insights-agent':
    'https://huggingface.co/spaces/PLACEHOLDER/health-insights-demo',
  'trading-bot-agent':
    'https://huggingface.co/spaces/PLACEHOLDER/trading-bot-demo',
  'ai-tutor-agent': 'https://huggingface.co/spaces/PLACEHOLDER/ai-tutor-demo',
  'customer-support-agent':
    'https://huggingface.co/spaces/PLACEHOLDER/support-agent-demo',
};

export default function DemoPage() {
  const router = useRouter();
  const { agent } = router.query;

  // TODO: Fetch agent details from database/API
  const agentId = typeof agent === 'string' ? agent : 'unknown';
  const demoUrl = demoUrls[agentId] || 'about:blank';

  return (
    <>
      <Head>
        <title>Demo: {agentId} | AI Agents Marketplace</title>
        <meta
          name="description"
          content={`Try the interactive demo for ${agentId}`}
        />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-700 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Marketplace
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Demo: {agentId.replace(/-/g, ' ')}
              </h1>
              <div className="w-32" /> {/* Spacer for centering */}
            </div>
          </div>
        </header>

        {/* Demo Instructions */}
        <section className="container mx-auto px-4 py-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              ℹ️ Demo Instructions
            </h2>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • This is an interactive demo of the AI agent. Try different
                inputs to see how it works.
              </li>
              <li>
                • Demo data is not saved and is for evaluation purposes only.
              </li>
              <li>
                • For production use, please purchase a subscription.
              </li>
              <li>
                • Questions? Check the{' '}
                <Link href="/docs" className="underline">
                  documentation
                </Link>
                .
              </li>
            </ul>
          </div>
        </section>

        {/* Demo Iframe */}
        <section className="container mx-auto px-4 pb-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {demoUrl === 'about:blank' ? (
              <div className="flex items-center justify-center h-[600px] bg-gray-100">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Demo Not Yet Available
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This agent demo is currently being set up.
                  </p>
                  <p className="text-sm text-gray-500">
                    TODO: Deploy agent to Gradio/Streamlit/HuggingFace and
                    update demo URL
                  </p>
                </div>
              </div>
            ) : (
              <iframe
                src={demoUrl}
                title={`Demo: ${agentId}`}
                className="w-full h-[600px] border-0"
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
              />
            )}
          </div>

          {/* Technical Details */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Technical Details
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-gray-600">Agent ID:</dt>
              <dd className="text-gray-900 font-mono">{agentId}</dd>
              <dt className="text-gray-600">Demo Type:</dt>
              <dd className="text-gray-900">
                {demoUrl.includes('gradio')
                  ? 'Gradio'
                  : demoUrl.includes('streamlit')
                  ? 'Streamlit'
                  : 'HuggingFace Space'}
              </dd>
              <dt className="text-gray-600">Status:</dt>
              <dd className="text-gray-900">
                {demoUrl === 'about:blank' ? (
                  <span className="text-yellow-600">⚠️ Placeholder</span>
                ) : (
                  <span className="text-green-600">✓ Active</span>
                )}
              </dd>
            </dl>
          </div>
        </section>
      </main>
    </>
  );
}
