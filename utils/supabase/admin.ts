// utils/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
        throw new Error('Supabase URL or Service Role Key is missing in environment variables.');
    }

    // Create a Supabase client with the service_role key
    // This client bypasses Row Level Security and has full admin privileges.
    return createClient(supabaseUrl, serviceKey, {
        auth: {
            autoRefreshToken: false, // Not needed for server-side admin operations
            persistSession: false,   // Not needed for server-side admin operations
        },
    });
}