import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, isConfigured } from '@/lib/firebase';
import { useRouter } from 'next/router';

/**
 * Authentication Hook and HOC
 * 
 * Provides authentication state and utilities throughout the app.
 * 
 * Usage:
 * 
 * 1. Wrap your app with AuthProvider in _app.tsx:
 *    <AuthProvider>
 *      <Component {...pageProps} />
 *    </AuthProvider>
 * 
 * 2. Use the hook in components:
 *    const { user, loading } = useAuth();
 * 
 * 3. Protect pages with HOC:
 *    export default withAuth(MyProtectedPage);
 */

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isConfigured: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured || !auth) {
      console.warn('Firebase not configured - authentication disabled');
      setLoading(false);
      return;
    }

    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication state
 * 
 * @returns {AuthContextType} Authentication state
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Higher-Order Component to protect pages that require authentication
 * 
 * Usage:
 * export default withAuth(MyProtectedPage);
 * 
 * Or with custom redirect:
 * export default withAuth(MyProtectedPage, '/custom-login');
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/login'
) {
  return function ProtectedRoute(props: P) {
    const { user, loading, isConfigured } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Wait for auth check to complete
      if (loading) return;

      // If Firebase is not configured, show a warning but allow access
      if (!isConfigured) {
        console.warn('Firebase not configured - protected route accessible without auth');
        return;
      }

      // Redirect to login if not authenticated
      if (!user) {
        router.push(redirectTo);
      }
    }, [user, loading, router, isConfigured]);

    // Show loading state
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Show warning if not configured
    if (!isConfigured) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-md">
            <div className="text-center">
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
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Authentication Not Configured
              </h2>
              <p className="text-gray-600 mb-4">
                Firebase authentication is not set up. See lib/firebase.ts for configuration instructions.
              </p>
              <Component {...props} />
            </div>
          </div>
        </div>
      );
    }

    // Don't render protected component until authenticated
    if (!user) {
      return null;
    }

    // Render protected component
    return <Component {...props} />;
  };
}

/**
 * Example usage in a protected page:
 * 
 * import { withAuth } from '@/hooks/useAuth';
 * 
 * function DashboardPage() {
 *   const { user } = useAuth();
 *   return <div>Welcome, {user?.email}</div>;
 * }
 * 
 * export default withAuth(DashboardPage);
 */
