import { NextApiRequest, NextApiResponse } from 'next';

/**
 * User Login API
 * 
 * This endpoint handles user login using Firebase Authentication.
 * 
 * TODO: Configuration Steps
 * 1. Set up Firebase project at https://console.firebase.google.com/
 * 2. Enable Authentication methods (Email/Password, Google)
 * 3. Configure Firebase for your application
 * 4. Add Firebase config to .env.local
 * 
 * IMPLEMENTATION OPTIONS:
 * 
 * Option A: Client-side Firebase Auth (Recommended)
 * - Handle login in the frontend using Firebase Client SDK
 * - Firebase manages sessions with JWT tokens automatically
 * - See components/Auth/LoginForm.tsx for client-side implementation
 * 
 * Option B: Custom Session Management
 * - Verify Firebase ID tokens server-side
 * - Create custom session cookies
 * - Use Firebase Admin SDK to verify tokens
 * 
 * Option C: Alternative Auth Provider
 * - Use Auth0, NextAuth.js, or other providers
 * - Follow provider-specific implementation guides
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, idToken } = req.body;

    // Validate input
    if (!email || (!password && !idToken)) {
      return res.status(400).json({
        error: 'Email and password (or idToken) are required',
      });
    }

    // TODO: Implement login logic
    //
    // For client-side Firebase Auth (recommended):
    // - Login is handled in the frontend
    // - This endpoint can be used to verify tokens or create session cookies
    //
    // Example with Firebase Admin SDK (token verification):
    // const admin = require('firebase-admin');
    // const decodedToken = await admin.auth().verifyIdToken(idToken);
    // const uid = decodedToken.uid;
    //
    // // Optional: Create session cookie
    // const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    // const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    //
    // res.setHeader('Set-Cookie', `session=${sessionCookie}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${expiresIn / 1000}`);

    // Placeholder response
    return res.status(501).json({
      error: 'Login endpoint not fully implemented',
      message: 'Please configure Firebase Authentication',
      instructions: [
        '1. Set up Firebase project and enable Authentication',
        '2. For client-side: Use LoginForm component',
        '3. For server-side: Install firebase-admin and implement token verification',
        '4. See comments in pages/api/auth/login.ts for details',
      ],
    });

    // Example success response:
    // return res.status(200).json({
    //   success: true,
    //   user: {
    //     uid: uid,
    //     email: decodedToken.email,
    //   },
    // });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Login failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
