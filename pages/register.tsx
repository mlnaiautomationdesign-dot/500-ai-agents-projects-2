import React from 'react';
import Head from 'next/head';
import RegisterForm from '@/components/Auth/RegisterForm';

export default function Register() {
  return (
    <>
      <Head>
        <title>Sign Up - AI Agents Platform</title>
        <meta name="description" content="Create your AI Agents Platform account" />
      </Head>
      <RegisterForm />
    </>
  );
}
