"use client";

import { useRef, useState } from "react";
import { Camera, LoaderCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PHONE_RULE = /^\+?\d[\d\s-]{6,18}\d$/;

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

    function handleReset() {
        setName(saved.name);
        setPhone(saved.phone);
        setImage(saved.image);
        setBroken(false);
    }

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        e.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5 MB");
            return;
        }

        const fd = new FormData();
        fd.append("image", file);

        setUploading(true);

        try {
            const { url } = await apiFetch<{ url: string }>(
                "/api/users/me/avatar",
                {
                    method: "POST",
                    auth: true,
                    body: fd,
                }
            );

            setImage(url);
            setBroken(false);

            toast.success("Image uploaded. Click Save Changes to apply.");
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Image upload failed"
            );
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const cleanName = name.trim();
        const cleanPhone = phone.trim();

        if (!cleanName) {
            toast.error("Name is required");
            return;
        }

        if (cleanPhone && !PHONE_RULE.test(cleanPhone)) {
            toast.error("Please enter a valid phone number");
            return;
        }

        setSaving(true);

        try {
            const { error } = await authClient.updateUser({
                name: cleanName,
                image: image || undefined,
                phone: cleanPhone || undefined,
            });

            if (error) {
                toast.error(error.message || "Could not update profile");
                return;
            }

            setSaved({
                name: cleanName,
                phone: cleanPhone,
                image,
            });

            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Could not update profile"
            );
        } finally {
            setSaving(false);
        }
    }

    const showImage = Boolean(image && !broken);
    const isBusy = saving || uploading;

    return (
        <form
            onSubmit={handleSubmit}
            aria-busy={isBusy}
            className="max-w-xl space-y-6 rounded-2xl border border-border/80 bg-card p-6 shadow-2xs sm:p-7"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={isBusy}
                    aria-label="Change profile image"
                    className="group relative size-24 shrink-0 rounded-full border-2 border-primary/25 bg-accent transition-all duration-200 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    <span className="block size-full overflow-hidden rounded-full">
                        {showImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={image}
                                alt="Profile"
                                referrerPolicy="no-referrer"
                                onError={() => setBroken(true)}
                                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <span className="flex size-full items-center justify-center text-3xl font-semibold text-primary">
                                {name.trim().charAt(0).toUpperCase() || "?"}
                            </span>
                        )}
                    </span>

                    <span
                        className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/55 text-white transition-opacity ${uploading
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                            }`}
                    >
                        {uploading ? (
                            <LoaderCircle
                                className="size-6 animate-spin"
                                aria-hidden="true"
                            />
                        ) : (
                            <Camera className="size-6" aria-hidden="true" />
                        )}
                    </span>

                    {!uploading && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex size-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-xs transition-transform duration-200 group-hover:scale-105">
                            <Camera className="size-4" aria-hidden="true" />
                        </span>
                    )}
                </button>

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    disabled={isBusy}
                    className="hidden"
                />

                <div className="space-y-1">
                    <h3 className="font-semibold text-card-foreground">
                        Profile Picture
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Click the avatar to upload a photo to personalize your
                        account.
                    </p>

                    <p className="text-xs text-muted-foreground">
                        JPG, PNG or WebP · Maximum 5 MB
                    </p>

                    {uploading && (
                        <p
                            className="text-xs font-medium text-primary"
                            role="status"
                        >
                            Uploading image...
                        </p>
                    )}
                </div>
            </div>
            <div className="border-t border-border/70" />
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                
                <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    readOnly
                    className="bg-muted/70 text-muted-foreground"
                />

                <p className="text-xs text-muted-foreground">
                    Your email address cannot be changed here.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>

                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={isBusy}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>

                <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                    disabled={isBusy}
                />

                <p className="text-xs text-muted-foreground">
                    Add your phone number for easier appointment communication.
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-border/70 pt-5">
                {dirty && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        disabled={isBusy}
                    >
                        <RotateCcw className="size-4" aria-hidden="true" />
                        Reset
                    </Button>
                )}

                <Button
                    type="submit"
                    disabled={!dirty || isBusy}
                    className="min-w-36"
                >
                    {saving ? (
                        <>
                            <LoaderCircle
                                className="size-4 animate-spin"
                                aria-hidden="true"
                            />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>
        </form>
    );
}

export function ProfileForm() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending || !session) {
        return (
            <div
                aria-hidden="true"
                className="max-w-xl animate-pulse space-y-6 rounded-2xl border border-border/80 bg-card p-6 sm:p-7"
            >
                <div className="flex items-center gap-5">
                    <div className="size-24 shrink-0 rounded-full bg-muted" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 rounded bg-muted" />
                        <div className="h-3.5 w-52 rounded bg-muted" />
                        <div className="h-3 w-36 rounded bg-muted" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="h-10 rounded-lg bg-muted" />
                    <div className="h-10 rounded-lg bg-muted" />
                    <div className="h-10 rounded-lg bg-muted" />
                </div>

                <div className="flex justify-end border-t border-border/70 pt-5">
                    <div className="h-10 w-36 rounded-lg bg-muted" />
                </div>
            </div>
        );
    }
    return <ProfileFormInner user={session.user} />;
}
