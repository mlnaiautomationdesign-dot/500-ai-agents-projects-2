import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

// Demo configuration map (in a real app, this would come from a database or CMS)
const demoConfig: Record<
  string,
  { title: string; description: string; embedUrl?: string }
> = {
  "health-assistant": {
    title: "AI Health Assistant",
    description:
      "Experience our AI Health Assistant that can analyze medical data and provide insights.",
    embedUrl: "https://example-demo.hf.space", // Replace with actual Gradio/HF Space URL
  },
  "trading-bot": {
    title: "Automated Trading Bot",
    description:
      "See how our trading bot analyzes market data in real-time.",
    embedUrl: "https://example-trading-demo.streamlit.app", // Replace with actual Streamlit URL
  },
  "virtual-tutor": {
    title: "Virtual AI Tutor",
    description:
      "Try our personalized AI tutor that adapts to your learning style.",
    embedUrl: "https://example-tutor.hf.space",
  },
  "customer-support": {
    title: "24/7 AI Chatbot",
    description: "Chat with our AI customer support bot and see it in action.",
    embedUrl: "https://example-chatbot.hf.space",
  },
  "content-writer": {
    title: "AI Content Writer",
    description: "Generate high-quality content with our AI writing assistant.",
    embedUrl: "https://example-writer.hf.space",
  },
  "code-assistant": {
    title: "AI Code Assistant",
    description:
      "Experience intelligent code completion and suggestions in real-time.",
    embedUrl: "https://example-code.hf.space",
  },
};

export default function DemoPage() {
  const router = useRouter();
  const { agent } = router.query;
  const agentId = typeof agent === "string" ? agent : "";

  const demo = demoConfig[agentId];

  if (!demo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demo Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The demo you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{demo.title} - Demo | AI Agents Marketplace</title>
        <meta name="description" content={demo.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
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
              <Link
                href={`/#buy-${agentId}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Buy This Agent
              </Link>
            </div>
          </div>
        </header>

        {/* Demo Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {demo.title}
            </h1>
            <p className="text-xl text-gray-600">{demo.description}</p>
          </div>

          {/* Demo Iframe Placeholder */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {demo.embedUrl ? (
              <div className="relative w-full" style={{ height: "600px" }}>
                <iframe
                  src={demo.embedUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${demo.title} Demo`}
                />
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-blue-50 border-2 border-blue-200 border-dashed rounded-xl p-8 mb-6">
                    <svg
                      className="w-16 h-16 mx-auto text-blue-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Demo Embed Placeholder
                    </h3>
                    <p className="text-gray-600 mb-4">
                      This is where the interactive demo will be embedded.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 text-left">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      📋 Instructions for Embedding Demos:
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                      <li>
                        <strong>Gradio:</strong> Host your demo on Hugging Face
                        Spaces and use the embed URL
                      </li>
                      <li>
                        <strong>Streamlit:</strong> Deploy to Streamlit Cloud
                        and get the app URL
                      </li>
                      <li>
                        <strong>Hugging Face Spaces:</strong> Use the direct
                        space URL with ?embed=true parameter
                      </li>
                      <li>
                        Update the <code className="bg-gray-200 px-1 rounded">embedUrl</code> in{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          pages/demo/[agent].tsx
                        </code>
                      </li>
                      <li>
                        For local testing, you can use any placeholder URL or
                        create a static demo
                      </li>
                    </ol>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>💡 Tip:</strong> See{" "}
                      <code className="bg-yellow-100 px-1 rounded">
                        /demo/README.md
                      </code>{" "}
                      for detailed instructions on hosting and embedding demos.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features/Benefits Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-600 mb-3">
                <svg
                  className="w-8 h-8"
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
              <h3 className="font-semibold text-gray-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600 text-sm">
                Optimized for performance with instant responses
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-600 mb-3">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600 text-sm">
                Enterprise-grade security with data encryption
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-600 mb-3">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Regular Updates
              </h3>
              <p className="text-gray-600 text-sm">
                Continuous improvements and new features
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
