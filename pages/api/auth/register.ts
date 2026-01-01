import { NextApiRequest, NextApiResponse } from 'next';

/*
 * User Registration API Route
 * 
 * Handles user registration using Firebase Authentication.
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a Firebase project: https://console.firebase.google.com/
 * 2. Enable Authentication > Sign-in method > Email/Password & Google
 * 3. Get your service account key from Project Settings > Service Accounts
 * 4. Add Firebase Admin SDK credentials to .env.local
 * 
 * ALTERNATIVE: Use Firebase Client SDK on frontend instead
 * This is just a server-side example for custom registration flows.
 * 
 * TODO: Install firebase-admin: npm install firebase-admin
 * TODO: Add FIREBASE_SERVICE_ACCOUNT_KEY to .env.local (base64 encoded JSON)
 * TODO: Implement email verification
 * TODO: Add rate limiting to prevent abuse
 * TODO: Integrate with database to store user profile data
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, displayName } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 8 characters' });
    }

    // TODO: Initialize Firebase Admin SDK
    // import admin from 'firebase-admin';
    // if (!admin.apps.length) {
    //   const serviceAccount = JSON.parse(
    //     Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '', 'base64').toString()
    //   );
    //   admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount),
    //   });
    // }

    // TODO: Create user with Firebase Admin
    // const userRecord = await admin.auth().createUser({
    //   email,
    //   password,
    //   displayName,
    //   emailVerified: false,
    // });

    // TODO: Store additional user data in database
    // await db.users.create({
    //   firebaseUid: userRecord.uid,
    //   email: userRecord.email,
    //   displayName,
    //   createdAt: new Date(),
    // });

    // TODO: Send verification email
    // const verificationLink = await admin.auth().generateEmailVerificationLink(email);
    // await sendEmail({
    //   to: email,
    //   subject: 'Verify your email',
    //   html: `Click here to verify: ${verificationLink}`,
    // });

    // Placeholder response
    res.status(200).json({
      message: 'User registration endpoint - TODO: Implement Firebase integration',
      note: 'Register users via Firebase client SDK on frontend instead',
      // userUid: userRecord.uid,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
