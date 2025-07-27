// app/actions/userActions.ts
'use server';

import { createClient as createAdminClient, User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { UserRole, ROLES } from '@/lib/auth/roles';

interface GetUsersResult {
    users: User[];
    error: string | null;
}

export async function getUsersList(): Promise<GetUsersResult> {
    // --- Step 1: Create a user-level client to check who is calling this action ---
    const supabase = await createClient(); // This uses your server helper with the ANON key

    // --- Step 2: Security Check - Verify the calling user is a Super Admin ---
    const { data: { user: callingUser } } = await supabase.auth.getUser();
    if (!callingUser || callingUser.app_metadata?.role !== ROLES.SUPER_ADMIN) {
        return { users: [], error: "Permission denied. You must be a Super Admin to view the user list." };
    }

    // --- Step 3: If the check passes, create the powerful ADMIN client ---
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, // The key with admin privileges
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    // --- Step 4: Perform the admin action using the ADMIN client ---
    try {
        const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 100,
        });

        if (usersError) {
            console.error("Server Action (getUsersList): Error fetching users list:", usersError);
            return { users: [], error: "Failed to fetch users list." };
        }

        return {
            users: usersData?.users || [],
            error: null,
        };

    } catch (error: any) {
        console.error("Server Action (getUsersList): Unexpected error:", error);
        return { users: [], error: "An unexpected server error occurred." };
    }
}

export async function updateUserRole(userId: string, newRole: UserRole): Promise<{ success: boolean; error?: string }> {
    // --- Step 1: Use our helper to create a client that can identify the calling user ---
    const supabase = await createClient(); // <-- ADDED await

    // --- Step 2: IMPORTANT SECURITY CHECK ---
    const { data: { user: callingUser } } = await supabase.auth.getUser();

    if (!callingUser || callingUser.app_metadata?.role !== ROLES.SUPER_ADMIN) {
        return { success: false, error: "Permission denied. You must be a Super Admin to change user roles." };
    }

    // --- Step 3: If the check passes, create a separate, powerful ADMIN client ---
    const supabaseAdminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    // --- Step 4: Perform the update using the ADMIN client ---
    const { error } = await supabaseAdminClient.auth.admin.updateUserById(
        userId,
        { app_metadata: { role: newRole } }
    );

    if (error) {
        console.error("Error updating user role:", error.message);
        return { success: false, error: error.message };
    }

    return { success: true };
}