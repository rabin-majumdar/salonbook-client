"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";

function SignInForm() {
    const router = useRouter();
    const params = useSearchParams();
    const redirectTo = params.get("redirect");
    const [loading, setLoading] = useState(false);

    const { data: session, isPending } = authClient.useSession();
    const target =
        redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard";

    useEffect(() => {
        if (!isPending && session) router.replace(target);
    }, [isPending, session, router, target]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const email = String(form.get("email") || "").trim();
        const password = String(form.get("password") || "");

        setLoading(true);
        const { error } = await authClient.signIn.email({ email, password });
        setLoading(false);

        if (error) {
            toast.error(error.message || "Invalid email or password");
            return;
        }
        toast.success("Signed in successfully");
        router.push(target);
        router.refresh();
    }

    if (isPending || session) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center text-muted-foreground">
                Loading...
            </div>
        );
    }

    return (
        <AuthShell
            title="Welcome back"
            subtitle="Sign in to manage your salon appointments."
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <AuthInput
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    icon={Mail}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                />
                <AuthInput
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    icon={Lock}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                />
                <Button type="submit" className="h-11 w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
            </div>
            <GoogleButton callbackURL={target} />

            <p className="mt-6 text-center text-sm text-muted-foreground">
                New to SalonBook?{" "}
                <Link href="/sign-up" className="font-medium text-foreground underline">
                    Create an account
                </Link>
            </p>
        </AuthShell>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={null}>
            <SignInForm />
        </Suspense>
    );
}