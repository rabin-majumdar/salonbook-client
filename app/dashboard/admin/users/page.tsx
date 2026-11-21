"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { fmtDate } from "@/lib/format";
import type { User } from "@/types/user";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Modal } from "@/components/dashboard/modal";
import { Button } from "@/components/ui/button";

export default function ManageUsersPage() {
    const [items, setItems] = useState<User[] | null>(null);
    const [details, setDetails] = useState<User | null>(null);
    const [toToggle, setToToggle] = useState<User | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        apiFetch<User[]>("/api/users", { auth: true })
            .then(setItems)
            .catch((e) => {
                toast.error(e.message);
                setItems([]);
            });
    }, []);

    async function confirmToggle() {
        if (!toToggle) return;
        const target = toToggle;
        const block = !target.isBlocked;
        setBusy(true);
        try {
            await apiFetch(`/api/users/${target._id}/${block ? "block" : "unblock"}`, {
                method: "PATCH",
                auth: true,
            });
            setItems((prev) =>
                prev
                    ? prev.map((u) => (u._id === target._id ? { ...u, isBlocked: block } : u))
                    : prev
            );
            toast.success(block ? "User blocked" : "User unblocked");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not update user");
        } finally {
            setBusy(false);
            setToToggle(null);
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Manage Users</h1>
            <p className="mt-1 text-muted-foreground">
                Registered customers. Blocked users cannot use protected features.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border">
                <table className="w-full min-w-2xl text-left text-sm">
                    <thead className="border-b bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Email</th>
                            <th className="px-4 py-3 font-medium">Joined</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items === null && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                    Loading users...
                                </td>
                            </tr>
                        )}
                        {items?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                    No registered customers yet.
                                </td>
                            </tr>
                        )}
                        {items?.map((u) => (
                            <tr key={u._id} className="border-b last:border-0">
                                <td className="px-4 py-3 font-medium">{u.name}</td>
                                <td className="px-4 py-3">{u.email}</td>
                                <td className="px-4 py-3">{u.createdAt ? fmtDate(u.createdAt) : "-"}</td>
                                <td className="px-4 py-3">
                                    <StatusBadge value={u.isBlocked ? "cancelled" : "active"} />
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        {u.isBlocked ? "Blocked" : "Active"}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setDetails(u)}>
                                            Details
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setToToggle(u)}>
                                            {u.isBlocked ? "Unblock" : "Block"}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal open={!!details} onClose={() => setDetails(null)} title="User details">
                {details && (
                    <dl className="space-y-2 text-sm">
                        <Row k="Name" v={details.name} />
                        <Row k="Email" v={details.email} />
                        <Row k="Phone" v={details.phone || "-"} />
                        <Row k="Joined" v={details.createdAt ? fmtDate(details.createdAt) : "-"} />
                        <Row k="Account" v={details.isBlocked ? "Blocked" : "Active"} />
                    </dl>
                )}
            </Modal>

            <Modal
                open={!!toToggle}
                onClose={() => setToToggle(null)}
                title={toToggle?.isBlocked ? "Unblock this user?" : "Block this user?"}
            >
                <p className="text-sm text-muted-foreground">
                    {toToggle?.isBlocked
                        ? `${toToggle?.name} will regain access to the platform.`
                        : `${toToggle?.name} will no longer be able to use protected features.`}
                </p>
                <div className="mt-5 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setToToggle(null)}>
                        Cancel
                    </Button>
                    <Button onClick={confirmToggle} disabled={busy}>
                        {toToggle?.isBlocked ? "Yes, unblock" : "Yes, block"}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

function Row({ k, v }: { k: string; v: string }) {
    return (
        <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-medium">{v}</dd>
        </div>
    );
}