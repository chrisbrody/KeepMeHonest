'use client';
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { usePathname } from 'next/navigation';

export default function HeaderAuth() {
    // Handle missing env vars first
    if (!hasEnvVars) {
        return (
            <div className="flex gap-4 items-center">
                <div>
                    <Badge variant={"default"} className="font-normal pointer-events-none">
                        Update .env.local
                    </Badge>
                </div>
                <div className="flex gap-2">
                    {/* Disabled Buttons */}
                    <Button asChild size="sm" variant={"outline"} disabled className="opacity-75 cursor-none pointer-events-none">
                        <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button asChild size="sm" variant={"default"} disabled className="opacity-75 cursor-none pointer-events-none">
                        <Link href="/sign-up">Sign up</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // return sign in / sign up buttons
    const pathname = usePathname();
    const isOnSignInPage = pathname === '/sign-in';
    const isOnSignUpPage = pathname === '/sign-up';

    return (
        <div className="flex gap-2">
            {isOnSignUpPage && (
                <Button asChild size="sm" variant={"outline"}>
                    <Link href="/sign-in">Sign in</Link>
                </Button>
            )}
            {isOnSignInPage && (
                <Button asChild size="sm" variant={"outline"}>
                    <Link href="/sign-up">Sign up</Link>
                </Button>
            )}
        </div>
    );
}