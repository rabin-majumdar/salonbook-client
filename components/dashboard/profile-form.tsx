"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PHONE_RULE = /^[+\d][\d\s-]{6,19}$/;

type FormUser = {
    name: string;
    email: string;
    image?: string | null;
    phone?: string | null;
};

function ProfileFormInner({ user }: { user: FormUser }) {
    const fileRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.phone ?? "");
    const [image, setImage] = useState(user.image ?? "");
    const [saved, setSaved] = useState({
        name: user.name,
        phone: user.phone ?? "",
        image: user.image ?? "",
    });

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [broken, setBroken] = useState(false);

    const dirty =
        name.trim() !== saved.name ||
        phone.trim() !== saved.phone ||
        image !== saved.image;

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            return toast.error("Please choose an image file");
        }
        if (file.size > 5 * 1024 * 1024) {
            return toast.error("Image must be smaller than 5 MB");
        }

        const fd = new FormData();
        fd.append("image", file);

        setUploading(true);
        try {
            const { url } = await apiFetch<{ url: string }>("/api/users/me/avatar", {
                method: "POST",
                auth: true,
                body: fd,
            });
            setImage(url);
            setBroken(false);
            toast.success("Image uploaded. Click Save Changes to apply it.");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Image upload failed");
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const cleanName = name.trim();
        const cleanPhone = phone.trim();

        if (!cleanName) return toast.error("Name is required");
        if (cleanPhone && !PHONE_RULE.test(cleanPhone)) {
            return toast.error("Please enter a valid phone number");
        }

        setSaving(true);
        const { error } = await authClient.updateUser({
            name: cleanName,
            image: image || undefined,
            phone: cleanPhone,
        });
        setSaving(false);

        if (error) {
            toast.error(error.message || "Could not update profile");
            return;
        }
        setSaved({ name: cleanName, phone: cleanPhone, image });
        toast.success("Profile updated successfully");
    }

    const showImage = image && !broken;

    return (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="group relative size-24 shrink-0 overflow-hidden rounded-full border"
                    aria-label="Change profile image"
                >
                    {showImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={image}
                            alt="Profile"
                            referrerPolicy="no-referrer"
                            onError={() => setBroken(true)}
                            className="size-full object-cover"
                        />
                    ) : (
                        <span className="flex size-full items-center justify-center bg-muted text-3xl font-semibold">
                            {name.charAt(0).toUpperCase() || "?"}
                        </span>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                        {uploading ? "Uploading..." : "Change"}
                    </span>
                    {uploading && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-xs font-medium text-white">
                            Uploading...
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
                <p className="text-sm text-muted-foreground">
                    Click the picture to upload a new image (max 5 MB).
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled readOnly />
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                />
            </div>

            <Button type="submit" disabled={!dirty || saving || uploading}>
                {saving ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
}

export function ProfileForm() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending || !session) {
        return <div className="h-64 max-w-xl animate-pulse rounded-2xl bg-muted" />;
    }
    return <ProfileFormInner user={session.user} />;
}