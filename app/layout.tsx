import React from "react";
import { createClient } from "@/utils/supabase/server";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import HeaderAuth from "@/components/header-auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LoggedInLayout } from '@/components/layout/logged-in-layout';
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Keep Me Honest",
    description: "The fastest way to start a new habit!",
};

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"],
});

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isLoggedIn = user !== null;

    return (
        <html lang="en" className={geistSans.className} suppressHydrationWarning>
        <body className="bg-background text-foreground" suppressHydrationWarning>
        <SidebarProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {isLoggedIn ? (
                    <LoggedInLayout>
                        {children}
                    </LoggedInLayout>
                ) : (
                    <main className="flex-1 flex flex-col items-center">
                        <div className="flex-1 w-full flex flex-col items-center gap-20">
                            <nav className="w-full flex justify-between border-b border-b-foreground/10 h-16">
                                <div className="w-full flex justify-between items-center p-3 px-5">
                                    <div className="flex gap-2 items-center font-semibold">
                                        <Link href={"/"}>KeepMeHonest</Link>
                                    </div>
                                    {!hasEnvVars ? <EnvVarWarning/> : <HeaderAuth/>}
                                </div>
                            </nav>
                            <div className="flex flex-col gap-20 max-w-5xl p-5">
                                {children}
                            </div>
                        </div>
                    </main>
                )}
            </ThemeProvider>
        </SidebarProvider>
        <Toaster />
        </body>
        </html>
    );
}