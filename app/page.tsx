// app/page.tsx
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInWithGoogleAction } from "@/app/actions/authActions";

export default async function Home(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;

    return (
        <>
            <main className="flex-1 flex flex-col gap-6 px-4">
                {/* Changed form to div to contain multiple forms */}
                <div className="flex-1 flex flex-col min-w-64">
                    <h1 className="text-2xl font-medium">Sign in</h1>
                    <p className="text-sm text-foreground">
                        Don't have an account?{" "}
                        <Link className="text-foreground font-medium underline" href="/sign-up">
                            Sign up
                        </Link>
                    </p>

                    {/* Email/Password Sign-in Form */}
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
                            className="w-full" // Make this button full width
                        >
                            Sign in
                        </SubmitButton>
                        <FormMessage message={searchParams} />
                    </form>

                    {/* Google Sign-in Button */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
                        </div>
                    </div>

                    {/* This button will trigger the signInWithGoogleAction */}
                    <form> {/* New form for Google sign-in */}
                        <SubmitButton
                            pendingText="Signing In with Google..."
                            formAction={signInWithGoogleAction}
                            className="w-full" // Make this button full width
                        >
                            Sign in with Google
                        </SubmitButton>
                    </form>
                </div>
            </main>
        </>
    );
}