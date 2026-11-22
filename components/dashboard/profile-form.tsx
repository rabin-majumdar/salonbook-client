"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PHONE_RULE = /^[+\d][\d\s-]{6,19}$/;

export function ProfileForm() {
    const { data: session, isPending } = authClient.useSession();
    const [saving, setSaving] = useState(false);

    if (isPending || !session) {
        return <div className="h-64 max-w-xl animate-pulse rounded-2xl bg-muted" />;
    }

    const user = session.user;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const name = String(fd.get("name") || "").trim();
        const image = String(fd.get("image") || "").trim();
        const phone = String(fd.get("phone") || "").trim();

        if (!name) return toast.error("Name is required");
        if (image) {
            try {
                new URL(image);
            } catch {
                return toast.error("Please enter a valid image URL");
            }
        }
        if (phone && !PHONE_RULE.test(phone)) {
            return toast.error("Please enter a valid phone number");
        }

        setSaving(true);
        const { error } = await authClient.updateUser({
            name,
            image: image || undefined,
            phone,
        });
        setSaving(false);

        if (error) {
            toast.error(error.message || "Could not update profile");
            return;
        }
        toast.success("Profile updated successfully");
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled readOnly />
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" defaultValue={user.name} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={user.phone ?? ""}
                    placeholder="+8801XXXXXXXXX"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="image">Profile image URL</Label>
                <Input
                    id="image"
                    name="image"
                    type="url"
                    defaultValue={user.image ?? ""}
                    placeholder="https://..."
                />
            </div>
            <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
}