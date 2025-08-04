import { SidebarProvider } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/modules/dashboard/ui/components/dashboard-sidebar'
import React from 'react'

import { DashboarNavbar as DashboardNavbar } from '@/modules/dashboard/ui/components/dashboard-navbar'

interface Props {
    children: React.ReactNode
};

const LayoutPage = ({ children }: Props) => {
    return (
        <SidebarProvider >
            <DashboardSidebar />
            <main className='flex flex-col h-screen w-screen bg-muted'>
                <DashboardNavbar />
                {children}
            </main>
        </SidebarProvider>
    )
}

export default LayoutPage