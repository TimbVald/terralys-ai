
import { HomeView } from '@/modules/dashboard/ui/views/home-view';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Force dynamic rendering due to headers usage
export const dynamic = 'force-dynamic';

const HomePage = async () => {
    let session;
    try {
        session = await auth.api.getSession({
            headers: await headers(),
        });
    } catch (error) {
        // Handle database connection errors gracefully
        console.error('Database connection error in dashboard page:', error);
        // Redirect to sign-in if we can't verify session due to DB issues
        redirect('/sign-in');
    }

    if (!session) {
        redirect('/sign-in');
    }
    return (
        <HomeView />
    )
}

export default HomePage
