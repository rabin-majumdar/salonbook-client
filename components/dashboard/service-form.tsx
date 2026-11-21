"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/constants/categories";
import type { Service } from "@/types/service";
import { Button } from "@/components/ui/button";

const field =
    "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

export function ServiceForm({ initial }: { initial?: Service }) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const isEdit = !!initial;

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        setPreview(file ? URL.createObjectURL(file) : null);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        const name = String(fd.get("serviceName") || "").trim();
        const price = Number(fd.get("price"));
        const duration = Number(fd.get("duration"));
        const file = fd.get("image") as File | null;
        const hasFile = !!file && file.size > 0;

        if (!name) return toast.error("Service name is required");
        if (!(price > 0)) return toast.error("Price must be a positive number");
        if (!(duration > 0)) return toast.error("Duration must be a positive number");
        if (!isEdit && !hasFile) return toast.error("Please upload a service image");
        if (hasFile && file.size > 5 * 1024 * 1024) {
            return toast.error("Image must be smaller than 5 MB");
        }
        if (!hasFile) fd.delete("image");

        setSubmitting(true);
        try {
            await apiFetch(isEdit ? `/api/services/${initial._id}` : "/api/services", {
                method: isEdit ? "PUT" : "POST",
                auth: true,
                body: fd,
            });
            toast.success(isEdit ? "Service updated" : "Service created");
            router.push("/dashboard/admin/services");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
            <div className="space-y-2">
                <label htmlFor="serviceName" className="text-sm font-medium">
                    Service name
                </label>
                <input
                    id="serviceName"
                    name="serviceName"
                    defaultValue={initial?.serviceName}
                    className={field}
                    required
                />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        defaultValue={initial?.category || CATEGORIES[0]}
                        className={field}
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        defaultValue={initial?.status || "active"}
                        className={field}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">
                        Price (৳)
                    </label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        min="1"
                        step="any"
                        defaultValue={initial?.price}
                        className={field}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="duration" className="text-sm font-medium">
                        Estimated duration (minutes)
                    </label>
                    <input
                        id="duration"
                        name="duration"
                        type="number"
                        min="1"
                        step="1"
                        defaultValue={initial?.duration}
                        className={field}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={initial?.description}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">
                    Service image {isEdit && "(leave empty to keep the current one)"}
                </label>
                <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="block w-full text-sm"
                />
                {(preview || initial?.image) && (
                    <div className="relative mt-2 h-40 w-64 overflow-hidden rounded-xl border">
                        <Image
                            src={preview || initial!.image}
                            alt="Service image preview"
                            fill
                            sizes="256px"
                            className="object-cover"
                            unoptimized={!!preview}
                        />
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <Button type="submit" disabled={submitting}>
                    {submitting
                        ? "Saving..."
                        : isEdit
                            ? "Update Service"
                            : "Create Service"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/admin/services")}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}