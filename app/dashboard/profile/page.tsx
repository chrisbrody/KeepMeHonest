// app/dashboard/profile/page.tsx
'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function ProfilePage() {

    const { isLoadingUser } = useAuthGuard();

    if (isLoadingUser) {
        return <LoadingSpinner fullscreen text="Loading profile..." />;
    }

    return (
        <div className="flex flex-col w-full gap-6">
            <h1 className="text-2xl font-bold">Profile</h1>

            <div className="p-6 border rounded-md bg-card text-card-foreground">
                <p className="text-muted-foreground">
                    This is the placeholder page for user profile.
                </p>
            </div>
        </div>
    );
}