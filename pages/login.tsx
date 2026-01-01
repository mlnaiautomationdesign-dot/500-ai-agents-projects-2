import React from 'react';
import Head from 'next/head';
import LoginForm from '@/components/Auth/LoginForm';

export default function Login() {
  return (
    <>
      <Head>
        <title>Login - AI Agents Platform</title>
        <meta name="description" content="Sign in to your AI Agents Platform account" />
      </Head>
      <LoginForm />
    </>
  );
}
