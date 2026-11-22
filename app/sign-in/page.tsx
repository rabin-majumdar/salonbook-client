"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/auth/google-button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function SignInForm() {
    const router = useRouter();
    const params = useSearchParams();
    const redirectTo = params.get("redirect");
    const [loading, setLoading] = useState(false);

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
        router.push(
            redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard"
        );
        router.refresh();
    }

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>Sign in to manage your appointments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="h-px flex-1 bg-border" />
                        or
                        <span className="h-px flex-1 bg-border" />
                    </div>
                    <GoogleButton
                        callbackURL={redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard"}
                    />

                    <p className="mt-4 text-center text-sm">
                        New to SalonBook?{" "}
                        <Link href="/sign-up" className="underline">
                            Create an account
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={null}>
            <SignInForm />
        </Suspense>
    );
}