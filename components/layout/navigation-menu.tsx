// components/layout/navigation-menu.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { SidebarNavLink } from '@/components/ui/sidebar-nav-link';
import { CollapsibleSidebarMenuItem } from './collapsible-sidebar-menu-item';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { ROLES } from '@/lib/auth/roles';
import {
    ListChecks,
    CalendarDays,
    Receipt,
    Settings,
    Users,
    Package,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import {cn} from "@/lib/utils";

// Define the types again for this component
type NavSubmenuItem = { title: string; href: string; };
type NavLinkItem = { title: string; href: string; icon: React.ReactNode; type: "link"; };
type NavCollapsibleItem = { title: string; href: string; icon: React.ReactNode; type: "submenu"; submenuItems: NavSubmenuItem[]; };
type NavigationItem = NavLinkItem | NavCollapsibleItem;

export function NavigationMenu() {
    // --- HOOKS ---
    const { userRole } = useAuthGuard();
    const { state: sidebarState } = useSidebar(); // This will now work correctly!
    const [isCollapsed, setIsCollapsed] = useState(sidebarState === 'collapsed');
    // --- USEPATHNAME for active state detection ---
    const pathname = usePathname();

    useEffect(() => {
        setIsCollapsed(sidebarState === 'collapsed');
    }, [sidebarState]);

    // --- NAVIGATION ITEMS LOGIC ---
    const navigationItems: NavigationItem[] = [
        { title: "Goals", href: "/dashboard/goals", icon: <ListChecks width={18} height={18} />, type: "link" },
    ];

    // if (userRole === ROLES.SUPER_ADMIN) {
    //     navigationItems.push({
    //         title: "Settings",
    //         href: "/dashboard/settings",
    //         icon: <Settings width={18} height={18} />,
    //         type: "submenu",
    //         submenuItems: [
    //             { title: "Activity Types", href: "/dashboard/settings/activitytypes" },
    //             { title: "Users", href: "/dashboard/settings/users" },
    //             { title: "Sync", href: "/dashboard/settings/sync" },
    //             // { title: "Users", href: "/dashboard/settings/users" },
    //         ]
    //     });
    // }

    // --- RENDER LOGIC ---
    return (
        <>
            {navigationItems.map((item) => {
                if (item.type === "link") {
                    const isActive = pathname === item.href;
                    return (
                        <SidebarNavLink
                            key={item.title}
                            href={item.href}
                            icon={item.icon}
                            className={cn(
                                "group",
                                isActive && "bg-gray-200"
                            )}
                        >
                            {item.title}
                        </SidebarNavLink>
                    );
                }
                if (item.type === "submenu") {
                    if (!isCollapsed) {
                        return (
                            <React.Fragment key={item.title}>
                                {/* The "Settings" header itself won't be active unless it has its own href */}
                                <div className="px-3 py-2 mt-2 flex items-center gap-3 font-semibold text-sm text-muted-foreground">
                                    {item.icon}
                                    <span>{item.title}</span>
                                </div>
                                <div className="flex flex-col gap-1 pl-7">
                                    {item.submenuItems.map((subItem) => {
                                        // Check if this sub-item is the active one
                                        const isActive = pathname === subItem.href;
                                        return (
                                            <SidebarNavLink
                                                key={subItem.title}
                                                href={subItem.href}
                                                icon={null}
                                                // Apply active class styling here too
                                                className={cn(
                                                    "group", // Ensure base styles from group are applied
                                                    isActive && "bg-gray-200" // Apply active style
                                                )}
                                            >
                                                {subItem.title}
                                            </SidebarNavLink>
                                        );
                                    })}
                                </div>
                            </React.Fragment>
                        );
                    } else {
                        return <CollapsibleSidebarMenuItem key={item.title} item={item} isCollapsed={isCollapsed} />;
                    }
                }
                return null;
            })}
        </>
    );
}