"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Circle, Image as ImageIcon, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export default function SignUpPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && session) router.replace("/dashboard");
    }, [isPending, session, router]);

    const rules = [
        { ok: password.length >= 6, label: "At least 6 characters" },
        { ok: /[A-Z]/.test(password), label: "One uppercase letter" },
        { ok: /[a-z]/.test(password), label: "One lowercase letter" },
    ];

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const name = String(form.get("name") || "").trim();
        const email = String(form.get("email") || "").trim();
        const image = String(form.get("image") || "").trim();

        if (!name) return toast.error("Please enter your full name");
        if (!PASSWORD_RULE.test(password)) {
            return toast.error(
                "Password needs 6+ characters with an uppercase and a lowercase letter"
            );
        }

        setLoading(true);
        const { error } = await authClient.signUp.email({
            name,
            email,
            password,
            image: image || undefined,
        });
        setLoading(false);

        if (error) {
            toast.error(error.message || "Sign up failed");
            return;
        }
        toast.success("Account created successfully");
        router.push("/dashboard");
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
            title="Create your account"
            subtitle="Join SalonBook and book your favourite services."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthInput
                    id="name"
                    name="name"
                    label="Full name"
                    icon={User}
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                />
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
                <div>
                    <AuthInput
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        icon={Lock}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <ul className="mt-2 space-y-1 text-xs">
                        {rules.map((r) => (
                            <li
                                key={r.label}
                                className={`flex items-center gap-2 ${r.ok ? "text-green-600" : "text-muted-foreground"
                                    }`}
                            >
                                {r.ok ? <Check className="size-3.5" /> : <Circle className="size-3.5" />}
                                {r.label}
                            </li>
                        ))}
                    </ul>
                </div>
                <AuthInput
                    id="image"
                    name="image"
                    type="url"
                    label="Profile image URL (optional)"
                    icon={ImageIcon}
                    placeholder="https://..."
                />
                <Button type="submit" className="h-11 w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
            </div>
            <GoogleButton />

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-medium text-foreground underline">
                    Sign in
                </Link>
            </p>
        </AuthShell>
    );
}