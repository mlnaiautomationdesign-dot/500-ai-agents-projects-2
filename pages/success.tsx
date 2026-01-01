import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;

  return (
    <>
      <Head>
        <title>Purchase Successful | AI Agents Marketplace</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Purchase Successful! 🎉
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for your purchase. You now have access to your AI agent.
          </p>

          {session_id && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Session ID</p>
              <p className="text-xs font-mono text-gray-900 break-all">
                {session_id}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md transition"
            >
              Back to Marketplace
            </Link>

            <Link
              href="#"
              className="block w-full py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition"
            >
              View My Agents
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            You should receive a confirmation email shortly.
          </p>
        </div>
      </main>
    </>
  );
}
