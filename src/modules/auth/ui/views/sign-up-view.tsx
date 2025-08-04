"use client"
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Loader2, OctagonAlertIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.string().email(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
})
.refine((data) => data.confirmPassword === data.password, {
                path: ['confirmPassword'],
                message: 'Passwords do not match',
            })

const SignUpView = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        try {
            setPending(true);
            setError(null);
            authClient.signUp.email(
                {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    callbackURL: "/dashboard",
                },
                {
                    onSuccess: () => {
                        setPending(false);
                    },
                    onError: ({error}) => {
                        setPending(false);
                        setError(error.message);
                    }
                }
            );
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    }

    const onSocial = (provider: "github" | "google") => {
        try {
            setPending(true);
            setError(null);
            authClient.signIn.social(
                {
                    provider: provider,
                    callbackURL: "/dashboard",
                },
                {
                    onSuccess: () => {
                        setPending(false);
                        router.push('/dashboard');
                    },
                    onError: ({error}) => {
                        setPending(false);
                        setError(error.message);
                    }
                }
            );
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    }


    return (
        <div className='flex flex-col gap-6'>
            <Card className='overflow-hidden p-0'>
                <CardContent className='grid p-0 md:grid-cols-2'>
                    <Form {...form}>
                        <form action="" onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
                            <div className='flex flex-col gap-6'>
                                <div className='flex flex-col items-center text-center'>
                                    <h1 className='text-3xl font-bold'>Welcome to TerraLys</h1>
                                    <p className='text-muted-foreground text-balance'>Sign up to continue</p>
                                </div>
                                 <div className='grid gap-3'>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder='John Doe' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='grid gap-3'>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder='example@example.com' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='grid gap-3'>
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder='**********' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                 <div className='grid gap-3'>
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder='**********' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {!!error && (
                                    <Alert className='bg-destructive/10 border-none'>
                                        <OctagonAlertIcon className='h-4 w-4 !text-destructive' />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}
                                <Button type='submit' className='w-full' disabled={pending}>
                                    {pending ? <Loader2 className='animate-spin' /> : 'Sign In'}
                                </Button>
                                <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t'>
                                    <span className='bg-card text-muted-foreground relative z-10 px-2'>Or continue with</span>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <Button onClick={() => onSocial("google")} variant='outline' type='button' className='w-full' disabled={pending}>
                                        {pending ? <Loader2 className='animate-spin' /> : 'Google'}
                                    </Button>
                                    <Button onClick={() => onSocial("github")} variant='outline' type='button' className='w-full' disabled={pending}>
                                        {pending ? <Loader2 className='animate-spin' /> : 'GitHub'}
                                    </Button>
                                </div>
                                <div className='text-center text-sm'>
                                    Already have an account? <Link href="/sign-in" className='underline underline-offset-4'>Sign Up</Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                    <div className='bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center'>
                        <img src="/logo.svg" alt="logo" className='w-[92px] h-[92px]' />
                        <p className='text-2xl font-semibold text-white'>
                            TerraLys
                        </p>

                    </div>
                </CardContent>
            </Card>

            <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline-offset-4'>

                By continuing, you agree to our <Link href="/terms" className='underline underline-offset-4'>Terms of Service</Link> and <Link href="/privacy" className='underline underline-offset-4'>Privacy Policy</Link>

                <p className='text-xs text-center'>
                    &copy; 2025 TerraLys. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default SignUpView