"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, Check, Circle, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthInput } from "@/components/auth/auth-input";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
const MAX_SIZE = 5 * 1024 * 1024;

export default function SignUpPage() {
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    const previewRef = useRef<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && session && !loading) router.replace("/dashboard");
    }, [isPending, session, loading, router]);

    useEffect(() => {
        return () => {
            if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        };
    }, []);

    const rules = [
        { ok: password.length >= 6, label: "At least 6 characters" },
        { ok: /[A-Z]/.test(password), label: "One uppercase letter" },
        { ok: /[a-z]/.test(password), label: "One lowercase letter" },
    ];

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const picked = e.target.files?.[0];
        e.target.value = "";
        if (!picked) return;

        if (!picked.type.startsWith("image/")) {
            return toast.error("Please choose an image file");
        }
        if (picked.size > MAX_SIZE) {
            return toast.error("Image must be smaller than 5 MB");
        }

        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        const url = URL.createObjectURL(picked);
        previewRef.current = url;
        setFile(picked);
        setPreview(url);
    }

    function removeFile() {
        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
        setFile(null);
        setPreview(null);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const name = String(form.get("name") || "").trim();
        const email = String(form.get("email") || "").trim();

        if (!name) return toast.error("Please enter your full name");
        if (!PASSWORD_RULE.test(password)) {
            return toast.error(
                "Password needs 6+ characters with an uppercase and a lowercase letter"
            );
        }

        setLoading(true);
        setStatus("Creating account...");
        const { error } = await authClient.signUp.email({ name, email, password });

        if (error) {
            setLoading(false);
            setStatus("");
            toast.error(error.message || "Sign up failed");
            return;
        }

        if (file) {
            setStatus("Uploading photo...");
            try {
                const fd = new FormData();
                fd.append("image", file);
                const { url } = await apiFetch<{ url: string }>("/api/users/me/avatar", {
                    method: "POST",
                    auth: true,
                    body: fd,
                });
                const { error: updateError } = await authClient.updateUser({ image: url });
                if (updateError) throw new Error(updateError.message);
            } catch {
                toast.warning(
                    "Account created, but the photo could not be uploaded. You can add it later from My Profile."
                );
            }
        }

        toast.success("Account created successfully");
        router.push("/dashboard");
    }

    if (isPending || (session && !loading)) {
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
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={loading}
                        aria-label="Choose profile photo"
                        className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-dashed bg-muted transition hover:border-primary"
                    >
                        {preview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={preview}
                                alt="Profile preview"
                                className="size-full object-cover"
                            />
                        ) : (
                            <span className="flex size-full items-center justify-center text-muted-foreground">
                                <Camera className="size-6" />
                            </span>
                        )}
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="hidden"
                    />
                    <div className="text-sm">
                        <p className="font-medium">Profile photo (optional)</p>
                        <p className="text-xs text-muted-foreground">
                            Choose an image from your device, up to 5 MB
                        </p>
                        <div className="mt-1 flex gap-3 text-xs">
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                disabled={loading}
                                className="font-medium text-primary hover:underline"
                            >
                                {preview ? "Change" : "Choose photo"}
                            </button>
                            {preview && (
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    disabled={loading}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                </div>

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
                                {r.ok ? (
                                    <Check className="size-3.5" />
                                ) : (
                                    <Circle className="size-3.5" />
                                )}
                                {r.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <Button type="submit" className="h-11 w-full" disabled={loading}>
                    {loading ? status || "Please wait..." : "Sign Up"}
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