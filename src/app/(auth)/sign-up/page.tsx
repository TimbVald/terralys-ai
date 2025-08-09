
import React from 'react'
import SignUpView from '@/modules/auth/ui/views/sign-up-view'
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const SignUpPage = async () => {
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    // Handle database connection errors gracefully
    console.error('Database connection error in sign-up page:', error);
    // If we can't check session due to DB issues, allow user to sign up
    session = null;
  }

  if (!!session) {
    redirect('/dashboard');
  }
  return (
      <SignUpView />
  )
}

export default SignUpPage
