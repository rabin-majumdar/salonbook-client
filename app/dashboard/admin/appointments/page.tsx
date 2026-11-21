"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { fmtDate } from "@/lib/format";
import type { AdminAppointment } from "@/types/appointment";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Modal } from "@/components/dashboard/modal";
import { Button } from "@/components/ui/button";

export default function ManageAppointmentsPage() {
    const [items, setItems] = useState<AdminAppointment[] | null>(null);
    const [filter, setFilter] = useState("");
    const [details, setDetails] = useState<AdminAppointment | null>(null);
    const [toCancel, setToCancel] = useState<AdminAppointment | null>(null);
    const [busyId, setBusyId] = useState("");

    useEffect(() => {
        apiFetch<AdminAppointment[]>("/api/appointments/admin/all", { auth: true })
            .then(setItems)
            .catch((e) => {
                toast.error(e.message);
                setItems([]);
            });
    }, []);

    function patchStatus(id: string, status: AdminAppointment["status"]) {
        setItems((prev) =>
            prev ? prev.map((a) => (a._id === id ? { ...a, status } : a)) : prev
        );
    }

    async function confirmAppointment(a: AdminAppointment) {
        setBusyId(a._id);
        try {
            await apiFetch(`/api/appointments/${a._id}/confirm`, {
                method: "PATCH",
                auth: true,
            });
            patchStatus(a._id, "confirmed");
            toast.success("Appointment confirmed");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not confirm");
        } finally {
            setBusyId("");
        }
    }

    async function confirmCancel() {
        if (!toCancel) return;
        const target = toCancel;
        setBusyId(target._id);
        try {
            await apiFetch(`/api/appointments/${target._id}/cancel`, {
                method: "PATCH",
                auth: true,
            });
            patchStatus(target._id, "cancelled");
            toast.success("Appointment cancelled");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not cancel");
        } finally {
            setBusyId("");
            setToCancel(null);
        }
    }

    const visible = items?.filter((a) => !filter || a.status === filter);

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Manage Appointments</h1>
                    <p className="mt-1 text-muted-foreground">
                        Review, confirm or cancel appointment requests.
                    </p>
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="h-10 rounded-lg border bg-background px-3 text-sm"
                >
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border">
                <table className="w-full min-w-208 text-left text-sm">
                    <thead className="border-b bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">Customer</th>
                            <th className="px-4 py-3 font-medium">Service</th>
                            <th className="px-4 py-3 font-medium">Date & Time</th>
                            <th className="px-4 py-3 font-medium">Price</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Payment</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items === null && (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                    Loading appointments...
                                </td>
                            </tr>
                        )}
                        {visible?.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                    No appointments found.
                                </td>
                            </tr>
                        )}
                        {visible?.map((a) => (
                            <tr key={a._id} className="border-b last:border-0">
                                <td className="px-4 py-3">
                                    <p className="font-medium">{a.customer?.name || "Unknown"}</p>
                                    <p className="text-xs text-muted-foreground">{a.customer?.email}</p>
                                </td>
                                <td className="px-4 py-3">
                                    {a.serviceId?.serviceName || "Service removed"}
                                </td>
                                <td className="px-4 py-3">
                                    {a.appointmentDate}
                                    <br />
                                    <span className="text-muted-foreground">{a.timeSlot}</span>
                                </td>
                                <td className="px-4 py-3">৳{a.servicePrice}</td>
                                <td className="px-4 py-3">
                                    <StatusBadge value={a.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge value={a.paymentStatus} />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setDetails(a)}>
                                            Details
                                        </Button>
                                        {a.status === "pending" && (
                                            <Button
                                                size="sm"
                                                disabled={busyId === a._id}
                                                onClick={() => confirmAppointment(a)}
                                            >
                                                Confirm
                                            </Button>
                                        )}
                                        {(a.status === "pending" || a.status === "confirmed") && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={busyId === a._id}
                                                onClick={() => setToCancel(a)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                open={!!details}
                onClose={() => setDetails(null)}
                title="Appointment details"
            >
                {details && (
                    <dl className="space-y-2 text-sm">
                        <Row k="Customer" v={details.customer?.name || "Unknown"} />
                        <Row k="Email" v={details.customer?.email || "-"} />
                        <Row k="Service" v={details.serviceId?.serviceName || "Service removed"} />
                        <Row k="Category" v={details.serviceId?.category || "-"} />
                        <Row k="Date" v={details.appointmentDate} />
                        <Row k="Time" v={details.timeSlot} />
                        <Row k="Price" v={`৳${details.servicePrice}`} />
                        <Row k="Status" v={details.status} />
                        <Row k="Payment" v={details.paymentStatus} />
                        <Row k="Requested on" v={fmtDate(details.createdAt)} />
                        <Row k="Customer message" v={details.message || "-"} />
                    </dl>
                )}
            </Modal>

            <Modal
                open={!!toCancel}
                onClose={() => setToCancel(null)}
                title="Cancel this appointment?"
            >
                <p className="text-sm text-muted-foreground">
                    The customer&apos;s appointment will be marked as cancelled.
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