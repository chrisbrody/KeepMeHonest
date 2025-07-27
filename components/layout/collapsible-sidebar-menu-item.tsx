'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    SidebarMenuButton,
} from '@/components/ui/sidebar';
import { SidebarNavLink } from '@/components/ui/sidebar-nav-link';
import { cn } from '@/lib/utils';

type NavCollapsibleItem = {
    title: string;
    href: string;
    icon: React.ReactNode;
    type: "submenu";
    submenuItems: { title: string; href: string; }[];
};

interface CollapsibleSidebarMenuItemProps {
    item: NavCollapsibleItem;
    isCollapsed: boolean;
}

export function CollapsibleSidebarMenuItem({ item, isCollapsed }: CollapsibleSidebarMenuItemProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    const handleNavigation = (href: string) => {
        console.log(`[CLICK] Submenu item for href: ${href} was clicked.`);

        // ENGAGE THE LOCK: The very first step is to set the lock.
        console.log('[ACTION] Engaging navigation lock.');
        setIsNavigating(true);

        // Now, close the UI. The tooltip won't be able to re-open because the lock is on.
        setIsPopoverOpen(false);
        setIsTooltipOpen(false); // Still good to force it closed immediately.

        setTimeout(() => {
            console.log(`[TIMER] Navigating to ${href}`);
            router.push(href);
        }, 50);
    };

    if (isCollapsed) {
        return (
            <TooltipProvider delayDuration={300}>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <Tooltip
                        open={isTooltipOpen}
                        onOpenChange={(isOpen) => {
                            // The tooltip can only show if the popover is closed AND we are NOT navigating.
                            if (!isPopoverOpen && !isNavigating) {
                                setIsTooltipOpen(isOpen);
                            } else {
                                // This log will now show us WHY the tooltip is being blocked.
                                console.log(`[BLOCKED] Tooltip change blocked. isPopoverOpen: ${isPopoverOpen}, isNavigating: ${isNavigating}`);
                            }
                        }}
                    >
                        <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                                <SidebarMenuButton className="w-full justify-center">
                                    {item.icon}
                                </SidebarMenuButton>
                            </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>{item.title}</p>
                        </TooltipContent>
                    </Tooltip>
                    <PopoverContent side="right" align="start" className="w-48 p-1">
                        <div className="flex flex-col gap-1 text-sm">
                            <p className="p-2 font-semibold">{item.title}</p>
                            {item.submenuItems?.map((subItem) => {
                                // DETERMINE IF THIS ITEM IS THE ACTIVE ONE
                                const isActive = pathname === subItem.href;

                                return (
                                    <Button
                                        key={subItem.title}
                                        variant="ghost"
                                        // USE cn TO CONDITIONALLY APPLY ACTIVE STYLES
                                        className={cn(
                                            "h-8 w-full justify-start px-2",
                                            isActive && "bg-accent text-accent-foreground" // This is the magic line!
                                        )}
                                        onClick={() => handleNavigation(subItem.href)}
                                    >
                                        {subItem.title}
                                    </Button>
                                );
                            })}
                        </div>
                    </PopoverContent>
                </Popover>
            </TooltipProvider>
        );
    }

    // --- RENDER FLAT LIST FOR EXPANDED SIDEBAR ---
    return (
        <div>
            <div className="px-3 py-2 mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                {item.icon}
                <span>{item.title}</span>
            </div>
            <div className="flex flex-col gap-1 pl-7">
                {item.submenuItems.map((subItem) => (
                    <SidebarNavLink key={subItem.title} href={subItem.href} icon={null}>
                        {subItem.title}
                    </SidebarNavLink>
                ))}
            </div>
        </div>
    );
}