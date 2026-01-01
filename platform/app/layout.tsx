import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: "AI Agents Marketplace - 500+ AI Agents",
  description: "Discover, purchase, and deploy cutting-edge AI agents for every industry",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-xl font-bold text-blue-600">
                  AI Agents Marketplace
                </Link>
                <div className="hidden md:flex space-x-4">
                  <Link href="/agents" className="text-gray-700 hover:text-blue-600">
                    Agents
                  </Link>
                  <Link href="/docs" className="text-gray-700 hover:text-blue-600">
                    Documentation
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {session?.user ? (
                  <>
                    <span className="text-sm text-gray-700">
                      {session.user.name || session.user.email}
                    </span>
                    <form action={async () => {
                      'use server'
                      const { signOut } = await import('@/lib/auth')
                      await signOut()
                    }}>
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                        Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" className="text-gray-700 hover:text-blue-600">
                      Sign In
                    </Link>
                    <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        {children}
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2026 AI Agents Marketplace. All rights reserved.</p>
              <p className="mt-2 text-sm">
                <Link href="/docs" className="text-blue-600 hover:underline">Documentation</Link>
                {' | '}
                <a href="https://github.com/mlnaiautomationdesign-dot/500-ai-agents-projects-2" className="text-blue-600 hover:underline">GitHub</a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
