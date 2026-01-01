import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                AI Agents Platform
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  href="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
                >
                  Agents
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-primary-600"
                >
                  Documentation
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">
                    {user.email}
                  </span>
                  <button
                    onClick={() => logout()}
                    className="btn-secondary text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary text-sm">
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary text-sm">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 AI Agents Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
