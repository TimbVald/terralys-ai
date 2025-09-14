"use client"

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { useRouter } from "next/navigation";

export const NavUser = () => {
    const { isMobile } = useSidebar()
    const router = useRouter();

    const { data, isPending } = authClient.useSession();
    const user = data?.user;

    if (isPending || !user) {
        return null;
    }

    const onLogout = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/sign-in');
                }
            }
        })
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-center bg-white/5 hover:bg-white/10 overflow-hidden cursor-pointer">
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >

                            {user.image ? (
                                <Avatar className="size-9 rounded-lg">
                                    <AvatarImage src={user.image} alt={user.name} />
                                </Avatar>
                            ) : (
                                <GeneratedAvatar seed={user.name} variant="initials" className="size-9 rounded-lg" />
                            )}

                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                {user.image ? (
                                    <Avatar className="size-9 rounded-lg">
                                        <AvatarImage src={user.image} alt={user.name} />
                                    </Avatar>
                                ) : (
                                    <GeneratedAvatar seed={user.name} variant="initials" className="size-9 rounded-lg" />
                                )}
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="h-10 hover:bg-radial from-green-600 to-green-900 border border-transparent hover:border-[#5D6B68]/10 cursor-pointer">
                                <Sparkles className="animate-spin" />
                                <span className="hover:text-white ">
                                    Upgrade to Pro
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer">
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem >
                            <DropdownMenuItem className="cursor-pointer" onClick={() => authClient.customer.portal()}>
                                <CreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onLogout} className="h-10 hover:bg-radial from-green-600 to-green-900 border border-transparent hover:border-[#5D6B68]/10 cursor-pointer" disabled={isPending}>
                            <LogOut />
                            <span className="hover:text-white ">
                                Log out
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
