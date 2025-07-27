// components/layout/logged-in-layout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarRail,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { usePathname } from 'next/navigation';
import { UserSidebarProfile } from './user-sidebar-profile';
import { NavigationMenu } from './navigation-menu';

interface LoggedInLayoutProps {
    children: React.ReactNode;
}

export function LoggedInLayout({ children }: LoggedInLayoutProps) {
    const { user, isLoadingUser } = useAuthGuard('/sign-in');
    const pathname = usePathname();

    if (isLoadingUser) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-full">
                <p className="text-xl font-semibold">Loading dashboard...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // --- Helper function to generate dynamic breadcrumb items ---
    const generateBreadcrumbItems = () => {
        // ... (this function remains exactly the same, no changes needed)
        const pathSegments = pathname.split('/').filter(segment => segment);
        const items = [];
        let currentPath = '';
        items.push(<BreadcrumbItem key="dashboard-root"><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>);
        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === pathSegments.length - 1;
            const displaySegment = segment.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            if (segment === "dashboard") return;
            if (isLast) {
                items.push(<React.Fragment key={currentPath}><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{displaySegment}</BreadcrumbPage></BreadcrumbItem></React.Fragment>);
            } else {
                items.push(<React.Fragment key={currentPath}><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href={currentPath}>{displaySegment}</BreadcrumbLink></BreadcrumbItem></React.Fragment>);
            }
        });
        if (pathSegments.length === 1 && pathSegments[0] === 'dashboard') {
            return <BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Overview</BreadcrumbPage></BreadcrumbItem></BreadcrumbList>;
        }
        return <BreadcrumbList>{items}</BreadcrumbList>;
    };

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon" className="sidebar-height">
                <SidebarHeader className="h-12">
                    <Link href="/dashboard" className={cn("flex items-center gap-2 font-semibold", "group-has-[[data-collapsible=icon]]/sidebar-wrapper:justify-center", "group-has-[[data-collapsible=icon]]/sidebar-wrapper:gap-0")}>
                        <Image src="/images/logo.png" alt="Eminent Interior Design Logo" width={28} height={28} className="h-7 w-auto" />
                        <span className={cn("whitespace-nowrap transition-opacity duration-200", "group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0", "group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-0", "group-has-[[data-collapsible=icon]]/sidebar-wrapper:overflow-hidden")}>
                          Keep Me Honest
                        </span>
                    </Link>
                </SidebarHeader>
                {/* RENDER THE NEW COMPONENT HERE */}
                <SidebarContent className="flex flex-col gap-1 text-sm p-3">
                    <NavigationMenu />
                </SidebarContent>
                <SidebarFooter>
                    <UserSidebarProfile user={user} />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <SidebarInset>
                <header>
                    <div className="border-border flex h-12 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            {generateBreadcrumbItems()}
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}