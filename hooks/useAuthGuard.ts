// /hooks/useAuthGuard.ts
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { ROLES, UserRole } from '@/lib/auth/roles';

export function useAuthGuard(redirectTo: string = '/sign-in'): { user: User | null; isLoadingUser: boolean; userRole: UserRole | null } {
    const [user, setUser] = useState<User | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const checkUser = useCallback(async () => {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();

        if (error || !currentUser) {
            setUser(null);
            setUserRole(null);
            if (window.location.pathname !== redirectTo) {
                router.replace(redirectTo);
            }
        } else {
            setUser(currentUser);
            const role = currentUser.app_metadata?.role || ROLES.USER;
            setUserRole(role as UserRole);
        }
        setIsLoadingUser(false);
    }, [router, redirectTo, supabase]);


    useEffect(() => {
        checkUser(); // Initial check on component mount

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event: any, session: any) => {
                // When the auth state changes (e.g., login, logout, token refresh),
                // re-run our main checkUser function which securely fetches the user from the server.
                checkUser();
            }
        );

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, [checkUser]);

    return { user, isLoadingUser, userRole };
}