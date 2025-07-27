// app/(auth-pages)/sign-up/page.tsx
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { signInWithGoogleAction } from "@/app/actions/authActions"; // Import the Google sign-in action

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
        <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
          <FormMessage message={searchParams} />
        </div>
    );
  }

  return (
      <>
        {/* Changed form to div to contain multiple forms */}
        <div className="flex flex-col min-w-64 max-w-64 mx-auto">
          <h1 className="text-2xl font-medium">Sign up</h1>
          <p className="text-sm text text-foreground">
            Already have an account?{" "}
            <Link className="text-primary font-medium underline" href="/sign-in">
              Sign in
            </Link>
          </p>

          {/* Email/Password Sign-up Form */}
          <form className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
            <Label htmlFor="password">Password</Label>
            <Input
                type="password"
                name="password"
                placeholder="Your password"
                minLength={6}
                required
            />
            <SubmitButton
                formAction={signUpAction}
                pendingText="Signing up..."
                className="w-full" // Make this button full width
            >
              Sign up
            </SubmitButton>
            <FormMessage message={searchParams} />
          </form>

          {/* Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or sign up with
            </span>
            </div>
          </div>

          {/* Google Sign-up Form */}
          <form> {/* New form for Google sign-up */}
            <SubmitButton
                pendingText="Signing up with Google..."
                formAction={signInWithGoogleAction}
                className="w-full" // Make this button full width
            >
              Sign up with Google
            </SubmitButton>
          </form>
        </div>
        {/*<SmtpMessage />*/}
      </>
  );
}