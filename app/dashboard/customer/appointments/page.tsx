"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { fmtDate } from "@/lib/format";
import type { Appointment } from "@/types/appointment";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Modal } from "@/components/dashboard/modal";
import { Button } from "@/components/ui/button";

type Filter = "all" | "pending" | "confirmed" | "cancelled" | "payment";

const TABS: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "payment", label: "Awaiting payment" },
    { key: "cancelled", label: "Cancelled" },
];

function matches(a: Appointment, f: Filter) {
    if (f === "all") return true;
    if (f === "payment") return a.status === "confirmed" && a.paymentStatus === "unpaid";
    return a.status === f;
}

export default function MyAppointmentsPage() {
    const [items, setItems] = useState<Appointment[] | null>(null);
    const [filter, setFilter] = useState<Filter>("all");
    const [details, setDetails] = useState<Appointment | null>(null);
    const [toCancel, setToCancel] = useState<Appointment | null>(null);
    const [busyId, setBusyId] = useState("");

    useEffect(() => {
        apiFetch<Appointment[]>("/api/appointments/my", { auth: true })
            .then(setItems)
            .catch((e) => {
                toast.error(e.message);
                setItems([]);
            });
    }, []);

    async function confirmCancel() {
        if (!toCancel) return;
        const target = toCancel;
        setBusyId(target._id);
        try {
            const updated = await apiFetch<Appointment>(
                `/api/appointments/${target._id}/cancel`,
                { method: "PATCH", auth: true }
            );
            setItems((prev) =>
                prev
                    ? prev.map((a) =>
                        a._id === target._id ? { ...a, status: updated.status } : a
                    )
                    : prev
            );
            toast.success("Appointment request cancelled");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not cancel");
        } finally {
            setBusyId("");
            setToCancel(null);
        }
    }

    async function payNow(a: Appointment) {
        setBusyId(a._id);
        try {
            const { url } = await apiFetch<{ url: string }>("/api/payments/checkout", {
                method: "POST",
                auth: true,
                body: JSON.stringify({ appointmentId: a._id }),
            });
            window.location.assign(url);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not start payment");
            setBusyId("");
        }
    }

    const visible = items?.filter((a) => matches(a, filter));
    const count = (f: Filter) => items?.filter((a) => matches(a, f)).length ?? 0;

    return (
        <div>
            <h1 className="text-2xl font-bold">My Appointments</h1>
            <p className="mt-1 text-muted-foreground">
                Track your requests, pay for confirmed appointments.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => setFilter(t.key)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition sm:gap-2 sm:px-4 sm:py-1.5 sm:text-sm ${filter === t.key
                            ? "border-primary bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                            }`}
                    >
                        {t.label}
                        {items && (
                            <span
                                className={`rounded-full px-1.5 text-xs ${filter === t.key ? "bg-white/25" : "bg-muted"
                                    }`}
                            >
                                {count(t.key)}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="mt-5 space-y-4">
                {items === null &&
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
                    ))}

                {items && visible?.length === 0 && (
                    <p className="rounded-2xl border bg-card p-6 text-center text-muted-foreground">
                        {items.length === 0
                            ? "You have no appointment requests yet."
                            : "No appointments match this filter."}
                    </p>
                )}

                {visible?.map((a) => (
                    <div
                        key={a._id}
                        className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center"
                    >
                        <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl sm:w-32">
                            <Image
                                src={a.serviceId?.image || "/hero.png"}
                                alt={a.serviceId?.serviceName || "Service"}
                                fill
                                sizes="128px"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="font-semibold">
                                {a.serviceId?.serviceName || "Service removed"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {a.serviceId?.category} · {a.appointmentDate} · {a.timeSlot} · ৳
                                {a.servicePrice}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Requested on {fmtDate(a.createdAt)}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-1">
                                <StatusBadge value={a.status} />
                                <StatusBadge value={a.paymentStatus} />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:flex-col">
                            <Button variant="outline" size="sm" onClick={() => setDetails(a)}>
                                Details
                            </Button>
                            {a.status === "pending" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={busyId === a._id}
                                    onClick={() => setToCancel(a)}
                                >
                                    Cancel
                                </Button>
                            )}
                            {a.status === "confirmed" && a.paymentStatus === "unpaid" && (
                                <Button
                                    size="sm"
                                    disabled={busyId === a._id}
                                    onClick={() => payNow(a)}
                                >
                                    {busyId === a._id ? "Redirecting..." : "Pay Now"}
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                open={!!details}
                onClose={() => setDetails(null)}
                title="Appointment details"
            >
                {details && (
                    <dl className="space-y-2 text-sm">
                        <Row k="Service" v={details.serviceId?.serviceName || "Service removed"} />
                        <Row k="Category" v={details.serviceId?.category || "-"} />
                        <Row k="Date" v={details.appointmentDate} />
                        <Row k="Time" v={details.timeSlot} />
                        <Row k="Price" v={`৳${details.servicePrice}`} />
                        <Row k="Status" v={details.status} />
                        <Row k="Payment" v={details.paymentStatus} />
                        <Row k="Requested on" v={fmtDate(details.createdAt)} />
                        <Row k="Your message" v={details.message || "-"} />
                    </dl>
                )}
            </Modal>

            <Modal
                open={!!toCancel}
                onClose={() => setToCancel(null)}
                title="Cancel this request?"
            >
                <p className="text-sm text-muted-foreground">
                    This pending appointment request will be cancelled. You can book again
                    later.
                </p>
                <div className="mt-5 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setToCancel(null)}>
                        Keep it
                    </Button>
                    <Button onClick={confirmCancel} disabled={!!busyId}>
                        Yes, cancel
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
            <dd className="text-right font-medium capitalize">{v}</dd>
        </div>
    );
}