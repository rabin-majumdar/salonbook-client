"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/constants/categories";
import type { Service } from "@/types/service";
import { Button } from "@/components/ui/button";

const MAX_SIZE = 5 * 1024 * 1024;

const field =
    "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function formatSize(bytes: number) {
    return bytes >= 1024 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
        : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function ServiceForm({ initial }: { initial?: Service }) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const previewRef = useRef<string | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const isEdit = !!initial;
    useEffect(() => {
        return () => {
            if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        };
    }, []);

    function pick(picked?: File | null) {
        if (!picked) return;
        if (!picked.type.startsWith("image/")) {
            return toast.error("Please choose an image file (JPG, PNG or WEBP)");
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

    function clearSelection() {
        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
        setFile(null);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        pick(e.target.files?.[0]);
        e.target.value = "";
    }

    function onDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragging(false);
        pick(e.dataTransfer.files?.[0]);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        const name = String(fd.get("serviceName") || "").trim();
        const price = Number(fd.get("price"));
        const duration = Number(fd.get("duration"));

        if (!name) return toast.error("Service name is required");
        if (!(price > 0)) return toast.error("Price must be a positive number");
        if (!(duration > 0)) return toast.error("Duration must be a positive number");
        if (!isEdit && !file) return toast.error("Please upload a service image");

        if (file) fd.set("image", file);

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

    const shownImage = preview || initial?.image || null;

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
                <div className="space-y-5">
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
                            rows={5}
                            defaultValue={initial?.description}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
                    <p className="text-sm font-medium">
                        Service image{" "}
                        {!isEdit && <span className="text-destructive">*</span>}
                    </p>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={onInputChange}
                        className="hidden"
                    />

                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                        className={`overflow-hidden rounded-2xl border-2 border-dashed bg-card transition ${dragging ? "border-primary bg-accent" : "border-border"
                            }`}
                    >
                        {shownImage ? (
                            <div className="relative aspect-4/3 w-full bg-muted">
                                <Image
                                    src={shownImage}
                                    alt="Service image preview"
                                    fill
                                    sizes="320px"
                                    className="object-cover"
                                    unoptimized={!!preview}
                                />
                                <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white">
                                    {preview ? "New image" : "Current image"}
                                </span>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                className="flex aspect-4/3 w-full flex-col items-center justify-center gap-2 px-4 text-center transition hover:bg-accent"
                            >
                                <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                                    <ImagePlus className="size-6" />
                                </span>
                                <span className="text-sm font-medium">
                                    Click to upload or drag and drop
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    JPG, PNG or WEBP, up to 5 MB
                                </span>
                            </button>
                        )}

                        {shownImage && (
                            <div className="space-y-2 border-t p-3">
                                {file && (
                                    <p className="truncate text-xs text-muted-foreground">
                                        {file.name} · {formatSize(file.size)}
                                    </p>
                                )}
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => inputRef.current?.click()}
                                    >
                                        <RefreshCw className="size-3.5" />
                                        {isEdit || file ? "Change" : "Choose"}
                                    </Button>
                                    {file && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={clearSelection}
                                        >
                                            <Trash2 className="size-3.5" />
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        {isEdit
                            ? "Leave the image unchanged to keep the current one."
                            : "A clear landscape photo works best. It appears on service cards."}
                    </p>
                </div>
            </div>

            <div className="flex gap-3 border-t pt-5">
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