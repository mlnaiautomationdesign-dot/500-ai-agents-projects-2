import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Protected User Info API
 * 
 * This endpoint returns the authenticated user's information.
 * It demonstrates how to protect API routes and verify authentication.
 * 
 * AUTHENTICATION METHODS:
 * 
 * 1. Firebase ID Token (Authorization header)
 *    - Frontend sends: Authorization: Bearer <firebase-id-token>
 *    - Verify token using Firebase Admin SDK
 * 
 * 2. Session Cookie
 *    - Set after login in pages/api/auth/login.ts
 *    - Verify using Firebase Admin SDK
 * 
 * 3. Custom JWT
 *    - Implement your own JWT token system
 *    - Verify using jsonwebtoken library
 * 
 * TODO: Configuration Steps
 * 1. Set up Firebase Admin SDK
 * 2. Initialize Admin in a separate lib/firebaseAdmin.ts file
 * 3. Implement token verification below
 * 4. Return actual user data from your database
 */

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  subscriptions?: string[];
  purchases?: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authorization token from header or cookie
    const authHeader = req.headers.authorization;
    const sessionCookie = req.cookies.session;

    if (!authHeader && !sessionCookie) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided',
      });
    }

    // Extract token from Authorization header
    let idToken: string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      idToken = authHeader.split('Bearer ')[1];
    }

    // TODO: Verify token using Firebase Admin SDK
    //
    // Example with Firebase Admin:
    // const admin = require('firebase-admin');
    // 
    // let decodedToken;
    // if (idToken) {
    //   decodedToken = await admin.auth().verifyIdToken(idToken);
    // } else if (sessionCookie) {
    //   decodedToken = await admin.auth().verifySessionCookie(sessionCookie);
    // }
    //
    // const uid = decodedToken.uid;
    //
    // // Fetch additional user data from Firestore
    // const userDoc = await admin.firestore().collection('users').doc(uid).get();
    // const userData = userDoc.data();

    // Placeholder: Return mock user data
    const mockUser: UserData = {
      uid: 'mock-user-id',
      email: 'user@example.com',
      displayName: 'Test User',
      photoURL: undefined,
      subscriptions: ['health-insights-agent'],
      purchases: [],
    };

    // Note: Remove this in production
    return res.status(200).json({
      user: mockUser,
      message: 'This is mock data. Configure Firebase Admin SDK for real authentication.',
      instructions: [
        '1. Install firebase-admin: npm install firebase-admin',
        '2. Create lib/firebaseAdmin.ts with Admin SDK initialization',
        '3. Verify tokens in this endpoint',
        '4. Fetch real user data from your database',
      ],
    });

    // Example real response:
    // return res.status(200).json({
    //   user: {
    //     uid: uid,
    //     email: decodedToken.email,
    //     displayName: userData?.displayName,
    //     photoURL: userData?.photoURL,
    //     subscriptions: userData?.subscriptions || [],
    //     purchases: userData?.purchases || [],
    //   },
    // });
  } catch (error) {
    console.error('User info error:', error);
    
    // Handle specific authentication errors
    if (error instanceof Error && error.message.includes('auth/')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    return res.status(500).json({
      error: 'Failed to get user info',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
