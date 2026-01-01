import Head from 'next/head';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import Link from 'next/link';

/**
 * Demo Page Template
 * 
 * This page displays an embedded demo for each AI agent.
 * 
 * TODO: Configure demo URLs
 * 1. Host your agent demos on one of these platforms:
 *    - Gradio: https://gradio.app/guides/sharing-your-app
 *    - Streamlit: https://streamlit.io/cloud
 *    - Hugging Face Spaces: https://huggingface.co/spaces
 * 
 * 2. Update the DEMO_URLS object below with your actual demo URLs
 * 
 * 3. For local testing, you can run:
 *    - Gradio: `gradio app.py` then use the public URL
 *    - Streamlit: `streamlit run app.py` then use the Sharing URL
 * 
 * 4. Embedding options:
 *    - Gradio: Use the URL directly in iframe
 *    - Streamlit: Add `?embed=true` to the URL for better iframe embedding
 *    - Hugging Face: Use the Spaces URL directly
 */

// TODO: Replace placeholder URLs with real demo URLs
const DEMO_URLS: Record<string, string> = {
  'health-insights-agent': 'https://your-demo-url.hf.space', // TODO: Add Hugging Face Space URL
  'trading-bot-agent': 'https://your-streamlit-app.streamlit.app', // TODO: Add Streamlit URL
  'ai-tutor-agent': 'https://your-gradio-demo.gradio.live', // TODO: Add Gradio URL
  'customer-support-agent': 'https://your-demo-url.hf.space', // TODO: Add demo URL
  'content-writer-agent': 'https://your-demo-url.hf.space', // TODO: Add demo URL
  'code-review-agent': 'https://your-demo-url.hf.space', // TODO: Add demo URL
};

const AGENT_INFO: Record<string, { title: string; description: string }> = {
  'health-insights-agent': {
    title: 'Health Insights Agent Demo',
    description:
      'Try analyzing sample medical reports and get AI-powered health insights.',
  },
  'trading-bot-agent': {
    title: 'Trading Bot Agent Demo',
    description:
      'Explore market analysis features and see how the bot makes trading decisions.',
  },
  'ai-tutor-agent': {
    title: 'AI Tutor Demo',
    description:
      'Experience personalized learning with our adaptive AI tutor.',
  },
  'customer-support-agent': {
    title: 'Customer Support Agent Demo',
    description: 'Chat with our AI support agent and see how it handles queries.',
  },
  'content-writer-agent': {
    title: 'Content Writer Agent Demo',
    description: 'Generate sample content and see the AI writing capabilities.',
  },
  'code-review-agent': {
    title: 'Code Review Agent Demo',
    description:
      'Submit code snippets for analysis and receive detailed feedback.',
  },
};

export default function DemoPage() {
  const router = useRouter();
  const { agent } = router.query;
  const agentId = typeof agent === 'string' ? agent : 'sample-agent';

  const demoUrl = DEMO_URLS[agentId];
  const agentInfo = AGENT_INFO[agentId] || {
    title: 'Agent Demo',
    description: 'Try out this AI agent demo.',
  };

  // Check if demo URL is configured
  const isDemoConfigured =
    demoUrl && !demoUrl.includes('your-demo-url') && !demoUrl.includes('your-');

  return (
    <>
      <Head>
        <title>{agentInfo.title} - AI Agents Marketplace</title>
        <meta name="description" content={agentInfo.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center"
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {agentInfo.title}
            </h1>
            <p className="text-lg text-gray-600">{agentInfo.description}</p>
          </div>

          {/* Demo Container */}
          <div className="card">
            {isDemoConfigured ? (
              <>
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Demo Instructions:</strong> This is an interactive
                    demo. Try different inputs and explore the agent&apos;s
                    capabilities. Note: Demo data is not saved.
                  </p>
                </div>

                {/* Demo Iframe */}
                <div className="relative w-full" style={{ minHeight: '600px' }}>
                  <iframe
                    src={demoUrl}
                    className="w-full border-0 rounded-lg"
                    style={{ minHeight: '600px', height: '80vh' }}
                    allow="accelerometer; camera; microphone; geolocation"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    title={`${agentInfo.title} Demo`}
                  />
                </div>

                {/* CTA Section */}
                <div className="mt-8 p-6 bg-primary-50 border border-primary-200 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Ready to unlock full features?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Purchase this agent to get unlimited access, priority
                    support, and advanced features.
                  </p>
                  <div className="flex gap-4">
                    <Link href={`/?agent=${agentId}`} className="btn-primary">
                      Buy Now
                    </Link>
                    <Link href="/docs" className="btn-secondary">
                      Learn More
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              // Placeholder when demo URL is not configured
              <div className="text-center py-16">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-2xl mx-auto">
                  <svg
                    className="w-16 h-16 text-yellow-500 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Demo Not Yet Configured
                  </h3>
                  <div className="text-left mb-6 space-y-3">
                    <p className="text-gray-700">
                      <strong>To configure this demo:</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>
                        Host your demo on Gradio, Streamlit, or Hugging Face
                        Spaces
                      </li>
                      <li>
                        Get the public URL for your hosted demo
                      </li>
                      <li>
                        Update the <code className="bg-gray-100 px-2 py-1 rounded">DEMO_URLS</code> object
                        in <code className="bg-gray-100 px-2 py-1 rounded">pages/demo/[agent].tsx</code>
                      </li>
                      <li>
                        See <code className="bg-gray-100 px-2 py-1 rounded">/demo/README.md</code> for
                        detailed instructions
                      </li>
                    </ol>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Link href="/demo/README.md" className="btn-primary">
                      View Setup Guide
                    </Link>
                    <Link href="/" className="btn-secondary">
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
