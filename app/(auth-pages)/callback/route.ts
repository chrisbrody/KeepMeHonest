// app/(auth-pages)/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server'; // Your server-side Supabase client utility
import { NextResponse } from 'next/server';
import { handleOAuthCallbackAndLink } from '@/app/actions/authActions'; // Import the new action

// This is a GET request handler because Supabase redirects with URL parameters
export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/dashboard'; // Default redirect after successful login

    if (code) {
        const supabase = await createClient();

        // Exchange the code for a Supabase session
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Successfully exchanged code for session.
            // Now, call the server action to handle email conflicts and linking.
            const result = await handleOAuthCallbackAndLink(requestUrl.origin);

            if (result.status === 'linked' || result.status === 'new_user') {
                // User is either newly signed in via Google, or their account was successfully linked.
                return NextResponse.redirect(requestUrl.origin + next);
            } else if (result.status === 'needs_linking') {
                // Conflict detected: User needs to confirm linking via email/password.
                // Redirect to the dedicated linking page.
                return NextResponse.redirect(requestUrl.origin + `/auth/link-account?email=${encodeURIComponent(result.email!)}`);
            } else {
                // Handle other errors or unexpected states from the linking action.
                return NextResponse.redirect(requestUrl.origin + `/auth/auth-error?message=${encodeURIComponent(result.message || 'An unknown error occurred during sign-in.')}`);
            }
        }
    }

    // If there's no code, or an error during code exchange, redirect to an error page.
    return NextResponse.redirect(requestUrl.origin + '/auth/auth-error?message=Could not sign in with Google. Please try again.');
}