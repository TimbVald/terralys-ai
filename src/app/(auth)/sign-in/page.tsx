import SignInView from '@/modules/auth/ui/views/sign-in-view'
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Force dynamic rendering due to headers usage
export const dynamic = 'force-dynamic';

const SignInPage = async () => {
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    // Handle database connection errors gracefully
    console.error('Database connection error in sign-in page:', error);
    // If we can't check session due to DB issues, allow user to sign in
    session = null;
  }

  if (!!session) {
    redirect('/dashboard');
  }
  return (
    <SignInView />
  )
}

export default SignInPage
