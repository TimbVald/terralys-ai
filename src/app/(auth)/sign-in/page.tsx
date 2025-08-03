import { Card } from '@/components/ui/card'
import React from 'react'
import SignInView from '@/modules/auth/ui/views/sign-in-view'
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const SignInPage = async () => {
  const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!!session) {
        redirect('/dashboard');
    }
  return (
    <SignInView />
  )
}

export default SignInPage
