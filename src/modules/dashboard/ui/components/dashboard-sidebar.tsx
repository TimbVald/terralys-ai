"use client"

import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils';
import { BotIcon, StarIcon, VideoIcon } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavUser } from './dashboard-user-button';
import { DashboardTrial } from './dashboard-trial';

// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
// }

const firstSection = [
    {
        icon: VideoIcon,
        label: "Meeting",
        href: "/meetings",
    },
    {
        icon: BotIcon,
        label: "Agent",
        href: "/agents",
    },
];

const secondSection = [
    {
        icon: StarIcon,
        label: "Upgrade",
        href: "/upgrade",
    },
];

export const DashboardSidebar = () => {
    const pathName = usePathname();
    return (
        <Sidebar>
            <SidebarHeader className='text-sidebar-accent-foreground'>
                <Link href="/dashboard" className='flex items-center gap-2 px-2 pt-2'>
                    <Image src="/logo.svg" alt="logo" height={36} width={36} />
                    <span className='text-lg font-bold'>TerraLys</span>
                </Link>
            </SidebarHeader>
            <div className='px-4 py-2'>
                <Separator className='opacity-10 text-[#5D6B68]' />
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {firstSection.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton asChild className={cn(
                                    "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                    pathName === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                                )}
                                    isActive={pathName === item.href}>
                                    <Link href={item.href}>
                                        <item.icon className='size-5' />
                                        <span className='text-sm font-medium tracking-tight'>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                <div className='px-4 py-2'>
                    <Separator className='opacity-10 text-[#5D6B68]' />
                </div>
                <SidebarGroup>
                    <SidebarMenu>
                        {secondSection.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton asChild className={cn(
                                    "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                    pathName === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                                )}
                                    isActive={pathName === item.href}>
                                    <Link href={item.href}>
                                        <item.icon className='size-5' />
                                        <span className='text-sm font-medium tracking-tight'>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className='text-white'>
                <DashboardTrial />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}