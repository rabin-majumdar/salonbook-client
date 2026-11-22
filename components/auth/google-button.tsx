"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function GoogleButton({
    callbackURL = "/dashboard",
}: {
    callbackURL?: string;
}) {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true);
        const { error } = await authClient.signIn.social({
            provider: "google",
            callbackURL,
        });
        if (error) {
            toast.error(error.message || "Google sign in failed");
            setLoading(false);
        }
    }

    return (
        <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleClick}
            disabled={loading}
        >
            {loading ? "Redirecting to Google..." : "Continue with Google"}
        </Button>
    );
}