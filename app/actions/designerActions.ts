// app/actions/designerActions.ts
'use server';

// Import createServerClient directly for admin client creation
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface SimpleUser {
    id: string;
    email: string | undefined;
}

interface GetAvailableUsersResult {
    availableUsers: SimpleUser[];
    error: string | null;
}

export async function getAvailableUsersForDesigners(): Promise<GetAvailableUsersResult> {
    const cookieStore = await cookies();

    // --- Create Admin Client (Service Role Key) ---
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
        console.error('Server Action Error (getAvailableUsersForDesigners): Supabase URL or Service Role Key missing.');
        return { availableUsers: [], error: "Server configuration error." };
    }

    const supabaseAdmin = createServerClient( /* ... config ... */
        supabaseUrl, serviceKey, { cookies: { /* handlers */
                get(name: string) { return cookieStore.get(name)?.value; },
                set(name: string, value: string, options: CookieOptions) { try { cookieStore.set({ name, value, ...options }); } catch (error) {} },
                remove(name: string, options: CookieOptions) { try { cookieStore.set({ name, value: '', ...options }); } catch (error) {} },
            } }
    );

    // --- Security Check: Caller Role ---
    const supabaseUserClient = createServerClient( /* ... config ... */
        supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { /* handlers */
                get(name: string) { return cookieStore.get(name)?.value; },
                set(name: string, value: string, options: CookieOptions) { try { cookieStore.set({ name, value, ...options }); } catch (error) {} },
                remove(name: string, options: CookieOptions) { try { cookieStore.set({ name, value: '', ...options }); } catch (error) {} },
            } }
    );
    const { data: { session }, error: sessionError } = await supabaseUserClient.auth.getSession();
    if (sessionError || !session || session.user.app_metadata?.is_super_admin !== true) {
        return { availableUsers: [], error: "Authorization failed." };
    }
    // --- End Security Check ---

    try {
        // --- Fetch Data using ADMIN Client ---
        // 1. Get all users (id, email, maybe name from metadata)
        const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
        if (usersError) throw usersError;

        const allUsers = usersData?.users.map(u => ({
            id: u.id,
            email: u.email,
            // name: u.user_metadata?.full_name // Example
        })) || [];

        // 2. Get all IDs from designers table
        const { data: designerData, error: designerError } = await supabaseAdmin
            .from('designers')
            .select('id'); // Only select the id column
        if (designerError) throw designerError;
        const designerIds = new Set(designerData?.map(d => d.id) || []);

        // --- Filter Users ---
        const available = allUsers.filter(user => user.id && user.email && !designerIds.has(user.id));

        return { availableUsers: available as SimpleUser[], error: null }; // Type assertion needed because email might be undefined initially

    } catch (error: any) {
        console.error("Error in getAvailableUsersForDesigners:", error);
        return { availableUsers: [], error: error.message || "Failed to fetch available users." };
    }
}