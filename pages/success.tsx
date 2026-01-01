import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;

  return (
    <Layout>
      <Head>
        <title>Purchase Successful - AI Agents Platform</title>
      </Head>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-10 w-10 text-green-600"
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Purchase Successful!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your AI agent is now ready to use.
          </p>
          {session_id && (
            <p className="text-sm text-gray-500 mb-8">
              Order ID: <code className="bg-gray-100 px-2 py-1 rounded">{session_id}</code>
            </p>
          )}
          <div className="space-x-4">
            <Link href="/" className="btn-primary">
              Browse More Agents
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              Go to Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-16 card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What's Next?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-primary-600 mr-3">1.</span>
              <span>Check your email for purchase confirmation and access instructions</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-3">2.</span>
              <span>Access your agent from the dashboard</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-3">3.</span>
              <span>Review the documentation to get started</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-3">4.</span>
              <span>Contact support if you need any assistance</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
