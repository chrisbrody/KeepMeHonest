// components/layout/user-sidebar-profile.tsx
'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, LogOut, Settings, MoreVertical } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

interface UserSidebarProfileProps {
    user: User | null;
}

export function UserSidebarProfile({ user }: UserSidebarProfileProps) {
    // Get isCollapsed directly from useSidebar() as this component is a descendant of SidebarProvider
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    if (!user) {
        // Render a sign-in button if no user
        return (
            <Button asChild size="sm" variant={"outline"}>
                <Link href="/sign-in">Sign in</Link>
            </Button>
        );
    }

    const displayUserName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const displayUserEmail = user.email || 'N/A';
    const displayUserAvatar = user.user_metadata?.avatar_url || '';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="lg"
                    className={cn(
                        "w-full flex items-center gap-3 rounded hover:bg-accent justify-start py-2",
                        isCollapsed ? "px-2" : "px-3"
                    )}
                >
                    {/* Avatar */}
                    <Avatar className={cn("h-8 w-8 rounded-lg", isCollapsed && "h-4 w-4")}>
                        <AvatarImage src={displayUserAvatar} alt={displayUserName}/>
                        <AvatarFallback
                            className="rounded-lg">{displayUserName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    {/* User Name and Email - hidden when collapsed */}
                    <div
                        className={cn(
                            "grid flex-1 text-left text-sm leading-tight transition-opacity duration-200",
                            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                        )}
                    >
                        <span className="truncate font-semibold">{displayUserName}</span>
                        <span className="truncate text-xs">{displayUserEmail}</span>
                    </div>

                    {/* MoreVertical icon - hidden when collapsed */}
                    <MoreVertical
                        className={cn(
                        "ml-auto h-4 w-4 transition-all duration-200 flex-shrink-0",
                            isCollapsed ? "opacity-0  w-0 overflow-hidden" : "opacity-100 w-auto"
                        )}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="right" // Always open to the right of the sidebar
                align="start" // Align to the start of the trigger
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-3 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={displayUserAvatar} alt={displayUserName} />
                            <AvatarFallback className="rounded-lg">{displayUserName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{displayUserName}</span>
                            <span className="truncate text-xs text-muted-foreground">{displayUserEmail}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center w-full px-2 py-1.5 text-sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0" asChild>
                    <form action={signOutAction} className="w-full">
                        <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start px-2 py-1.5 text-sm"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </Button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}