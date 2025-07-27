// app/actions/authActions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export async function signInWithGoogleAction() {
    const supabase = await createClient(); // <--- Call your async createClient

    const redirectUrl = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`
        : 'http://localhost:3000/auth/callback';

    console.log('Attempting Google OAuth with redirectTo:', redirectUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
        },
    });

    if (error) {
        console.error('Error initiating Google sign-in:', error);
        redirect('/sign-in?message=Could not initiate Google sign-in. Please try again.');
    }

    if (data.url) {
        redirect(data.url);
    }

    redirect('/sign-in?message=Failed to get Google sign-in URL.');
}

interface OAuthCallbackResult {
    status: 'linked' | 'new_user' | 'needs_linking' | 'error';
    message?: string;
    email?: string;
}

export async function handleOAuthCallbackAndLink(origin: string): Promise<OAuthCallbackResult> {
    const supabase = await createClient(); // <--- Call your async createClient
    const supabaseAdmin = createAdminClient(); // Initialize the admin client

    const { data: { user: googleUser }, error: userError } = await supabase.auth.getUser();

    if (userError || !googleUser) {
        console.error('Error getting user after OAuth callback:', userError);
        return { status: 'error', message: 'Could not retrieve user session after Google sign-in.' };
    }

    const googleEmail = googleUser.email;
    if (!googleEmail) {
        console.error('Google user has no email:', googleUser);
        return { status: 'error', message: 'Google account does not have an associated email.' };
    }

    const { data: allUsersData, error: fetchError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1, // Start from page 1
        perPage: 1000,
    });

    if (fetchError) {
        console.error('Error fetching existing users for linking:', fetchError);
        return { status: 'error', message: 'Failed to check for existing accounts.' };
    }

    const existingUsers = allUsersData?.users || []; // Ensure it's an array

    const emailPasswordUser = existingUsers.find(
        (u) => u.email === googleEmail && u.id !== googleUser.id && u.app_metadata.provider === 'email'
    );

    if (emailPasswordUser) {
        console.log(`Conflict: Email/password user (${emailPasswordUser.id}) found for email ${googleEmail}.`);
        await supabase.auth.signOut();
        return {
            status: 'needs_linking',
            message: 'It looks like you already have an account with this email. Please sign in with your email and password to link your Google account.',
            email: googleEmail,
        };
    } else {
        console.log(`User ${googleUser.id} (${googleUser.email}) signed in/created via Google. No email/password conflict.`);
        return { status: 'new_user', message: 'Signed in successfully with Google.' };
    }
}

export async function linkGoogleAccount(email: string, password: string): Promise<OAuthCallbackResult> {
    const supabase = await createClient(); // <--- Call your async createClient
    const supabaseAdmin = createAdminClient();

    const { data: { user: primaryUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError || !primaryUser) {
        console.error('Error signing in with email/password for linking:', signInError);
        return { status: 'error', message: signInError?.message || 'Invalid email or password.' };
    }

    const { data: allGoogleUsersData, error: fetchGoogleUserError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000, // Same consideration as above
    });

    if (fetchGoogleUserError) {
        console.error('Error fetching Google user for linking:', fetchGoogleUserError);
        return { status: 'error', message: 'Failed to find Google account for linking.' };
    }

    const googleUsers = allGoogleUsersData?.users || [];

    const orphanGoogleUser = googleUsers.find(
        (u) => u.email === email && u.app_metadata.provider === 'google' && u.id !== primaryUser.id
    );

    if (!orphanGoogleUser) {
        console.warn('No orphan Google user found for email:', email);
        return { status: 'error', message: 'No Google account found to link. Please try signing in with Google again.' };
    }

    const updatedMetadata = {
        ...primaryUser.user_metadata,
        linked_providers: Array.from(new Set([...(primaryUser.user_metadata.linked_providers || []), 'google'])),
        google_id: orphanGoogleUser.id,
    };

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(primaryUser.id, {
        user_metadata: updatedMetadata,
    });

    if (updateError) {
        console.error('Error updating primary user metadata for linking:', updateError);
        return { status: 'error', message: 'Failed to link Google account to your profile.' };
    }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(orphanGoogleUser.id);

    if (deleteError) {
        console.error('Error deleting orphan Google user:', deleteError);
    }

    console.log(`Successfully linked Google account (${orphanGoogleUser.id}) to primary user (${primaryUser.id}).`);
    return { status: 'linked', message: 'Google account linked successfully!' };
}