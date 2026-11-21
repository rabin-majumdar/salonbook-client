"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/types/service";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Modal } from "@/components/dashboard/modal";
import { Button } from "@/components/ui/button";

export default function ManageServicesPage() {
    const [items, setItems] = useState<Service[] | null>(null);
    const [toDelete, setToDelete] = useState<Service | null>(null);
    const [busyId, setBusyId] = useState("");

    useEffect(() => {
        apiFetch<Service[]>("/api/services/admin/all", { auth: true })
            .then(setItems)
            .catch((e) => {
                toast.error(e.message);
                setItems([]);
            });
    }, []);

    async function toggleStatus(s: Service) {
        const next = s.status === "active" ? "inactive" : "active";
        setBusyId(s._id);
        try {
            await apiFetch(`/api/services/${s._id}`, {
                method: "PUT",
                auth: true,
                body: JSON.stringify({ status: next }),
            });
            setItems((prev) =>
                prev ? prev.map((x) => (x._id === s._id ? { ...x, status: next } : x)) : prev
            );
            toast.success(`Service ${next === "active" ? "activated" : "deactivated"}`);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not update status");
        } finally {
            setBusyId("");
        }
    }

    async function confirmDelete() {
        if (!toDelete) return;
        const target = toDelete;
        setBusyId(target._id);
        try {
            await apiFetch(`/api/services/${target._id}`, { method: "DELETE", auth: true });
            setItems((prev) => (prev ? prev.filter((x) => x._id !== target._id) : prev));
            toast.success("Service deleted");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not delete service");
        } finally {
            setBusyId("");
            setToDelete(null);
        }
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Manage Services</h1>
                    <p className="mt-1 text-muted-foreground">
                        Add, update, activate or remove services.
                    </p>
                </div>
                <Link
                    href="/dashboard/admin/services/new"
                    className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                    Add Service
                </Link>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border">
                <table className="w-full min-w-176 text-left text-sm">
                    <thead className="border-b bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">Service</th>
                            <th className="px-4 py-3 font-medium">Category</th>
                            <th className="px-4 py-3 font-medium">Price</th>
                            <th className="px-4 py-3 font-medium">Duration</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items === null && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                    Loading services...
                                </td>
                            </tr>
                        )}
                        {items?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                    No services yet. Add your first one.
                                </td>
                            </tr>
                        )}
                        {items?.map((s) => (
                            <tr key={s._id} className="border-b last:border-0">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                                            <Image
                                                src={s.image}
                                                alt={s.serviceName}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="font-medium">{s.serviceName}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{s.category}</td>
                                <td className="px-4 py-3">৳{s.price}</td>
                                <td className="px-4 py-3">{s.duration} min</td>
                                <td className="px-4 py-3">
                                    <StatusBadge value={s.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            href={`/dashboard/admin/services/${s._id}/edit`}
                                            className="inline-flex h-8 items-center rounded-lg border px-3 text-xs font-medium hover:bg-muted"
                                        >
                                            Edit
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={busyId === s._id}
                                            onClick={() => toggleStatus(s)}
                                        >
                                            {s.status === "active" ? "Deactivate" : "Activate"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={busyId === s._id}
                                            onClick={() => setToDelete(s)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                open={!!toDelete}
                onClose={() => setToDelete(null)}
                title="Delete this service?"
            >
                <p className="text-sm text-muted-foreground">
                    &quot;{toDelete?.serviceName}&quot; will be removed permanently. This
                    cannot be undone.
                </p>
                <div className="mt-5 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setToDelete(null)}>
                        Keep it
                    </Button>
                    <Button onClick={confirmDelete} disabled={!!busyId}>
                        Yes, delete
                    </Button>
                </div>
            </Modal>
        </div>
    );
}