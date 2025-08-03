"use client"
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React from 'react'

export const HomeView = () => {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    return (
        <div className='flex flex-col p-4 gap-y-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Dashboard</h1>
                <div className='flex items-center gap-x-2'>
                    <span className='text-muted-foreground'>Welcome, {session?.user?.name}</span>
                </div>
                <div className='flex items-center gap-x-2'>
                    <Button variant="destructive" onClick={() => authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                router.push('/sign-in');
                            }
                        }
                    })}>Sign out</Button>
                </div>
            </div>
        </div>
    )
}