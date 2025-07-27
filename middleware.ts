import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Temporarily disable Supabase middleware for Edge Runtime compatibility
  // TODO: Re-enable once environment variables are configured
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only run middleware on specific protected routes when we need auth
    // Disabled for now to prevent deployment issues
    // "/dashboard/:path*",
    // "/protected/:path*"
  ],
};
