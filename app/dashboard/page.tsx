// app/dashboard/page.tsx
'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useIsMobile } from '@/hooks/use-mobile';

export default function DashboardPage() {
    const { user, isLoadingUser, userRole } = useAuthGuard('/sign-in');

    const isMobile = useIsMobile();

    return (
        <div className="flex flex-col w-full gap-6">
            <div className="border-border bg-muted text-muted-foreground w-full rounded-md border border-dashed p-6 text-center">
                <h2 className="text-lg font-semibold text-foreground mb-2">Welcome to your Dashboard!</h2>
                <p>This is where your main dashboard widgets and information will go.</p>
                <div className="mt-4 p-4 border rounded-md bg-card text-card-foreground">
                    {/* Displaying user data */}
                    <p>User: {user?.email}</p>
                    <p>Role: {userRole}</p>
                    {isMobile !== undefined && (
                        <p className="mt-2">
                            You are viewing on a {isMobile ? 'mobile' : 'desktop/tablet'} device.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}