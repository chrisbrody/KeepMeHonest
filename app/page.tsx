import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TestTwilio from "@/components/test-twilio";
import Link from "next/link";

export default async function Home(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;

    return (
        <>
            <main className="flex-1 flex flex-col gap-8 px-4">
                {/* Twilio Test Section */}
                <div className="w-full">
                    <TestTwilio />
                </div>

                {/* Sign In Section */}
                <div className="flex-1 flex flex-col min-w-64">
                    <h1 className="text-2xl font-medium">Sign in</h1>
                    <p className="text-sm text-foreground">
                        Don't have an account?{" "}
                        <Link className="text-foreground font-medium underline" href="/sign-up">
                            Sign up
                        </Link>
                    </p>

                    <form className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" placeholder="you@example.com" required />
                        <div className="flex justify-between items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                className="text-xs text-foreground underline"
                                href="/forgot-password"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <Input
                            type="password"
                            name="password"
                            placeholder="Your password"
                            required
                        />
                        <SubmitButton
                            pendingText="Signing In..."
                            formAction={signInAction}
                            className="w-full"
                        >
                            Sign in
                        </SubmitButton>
                        <FormMessage message={searchParams} />
                    </form>
                </div>
            </main>
        </>
    );
}