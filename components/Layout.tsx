import Link from 'next/link';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                AI Agents Marketplace
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/demo/sample-agent"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Demos
              </Link>
              <Link
                href="/login"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 AI Agents Marketplace. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Powered by Next.js, Stripe, and Firebase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
