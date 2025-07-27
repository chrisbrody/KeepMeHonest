// components/ui/sidebar-nav-link.tsx
'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import React, { forwardRef } from 'react';

interface SidebarNavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
    icon: React.ReactNode;
    children: React.ReactNode;
    isActive?: boolean;
}

const SidebarNavLink = forwardRef<HTMLAnchorElement, SidebarNavLinkProps>(
    ({ icon, children, className, isActive = false, ...props }, ref) => {
        return (
            <Link
                ref={ref}
                className={cn(
                    "flex items-center gap-3 rounded px-3 py-2 transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    // These are the key classes for hiding text and centering icons when sidebar is collapsed
                    "group-has-[[data-collapsible=icon]]/sidebar-wrapper:justify-center",
                    "group-has-[[data-collapsible=icon]]/sidebar-wrapper:px-2",
                    "group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-fit", // Shrink width to fit icon
                    className
                )}
                {...props}
            >
                {icon}
                <span
                    className={cn(
                        "whitespace-nowrap transition-opacity duration-200",
                        // Base hidden state for text when collapsed
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0",
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-0",
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:overflow-hidden",
                        // Tooltip positioning (always absolute)
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:absolute", // Keep absolute
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:left-full", // Position to the right
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:ml-2", // Margin from icon
                        // Tooltip styling
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:text-xs",
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:bg-popover",
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-1",
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:rounded",
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:shadow-md",
                        // Make it visible on hover
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:group-hover:opacity-100",
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:group-hover:w-auto",
                        "group-has-[[data-collapsible=icon]]/sidebar-wrapper:group-hover:pointer-events-auto",
                        // REMOVE group-hover:relative, group-hover:left-0, group-hover:ml-0
                        // These were causing the layout shift by pulling it out of absolute positioning.
                    )}
                >
          {children}
        </span>
            </Link>
        );
    }
);
SidebarNavLink.displayName = "SidebarNavLink";

export { SidebarNavLink };