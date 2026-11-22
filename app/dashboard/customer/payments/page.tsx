"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { fmtDate } from "@/lib/format";
import { StatusBadge } from "@/components/dashboard/status-badge";

type Payment = {
    _id: string;
    amount: number;
    currency: string;
    stripeSessionId: string;
    status: "paid" | "failed";
    createdAt: string;
    appointmentId: {
        appointmentDate: string;
        timeSlot: string;
        serviceId: { serviceName: string } | null;
    } | null;
};

export default function PaymentHistoryPage() {
    const [items, setItems] = useState<Payment[] | null>(null);

    useEffect(() => {
        apiFetch<Payment[]>("/api/payments/my", { auth: true })
            .then(setItems)
            .catch((e) => {
                toast.error(e.message);
                setItems([]);
            });
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold">Payment History</h1>
            <p className="mt-1 text-muted-foreground">
                Payments confirmed by Stripe for your appointments.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border">
                <table className="w-full min-w-176 text-left text-sm">
                    <thead className="border-b bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">Service</th>
                            <th className="px-4 py-3 font-medium">Appointment</th>
                            <th className="px-4 py-3 font-medium">Amount</th>
                            <th className="px-4 py-3 font-medium">Reference</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items === null && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                    Loading payments...
                                </td>
                            </tr>
                        )}
                        {items?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                    No payments yet.
                                </td>
                            </tr>
                        )}
                        {items?.map((p) => (
                            <tr key={p._id} className="border-b last:border-0">
                                <td className="px-4 py-3 font-medium">
                                    {p.appointmentId?.serviceId?.serviceName || "Service removed"}
                                </td>
                                <td className="px-4 py-3">
                                    {p.appointmentId
                                        ? `${p.appointmentId.appointmentDate}, ${p.appointmentId.timeSlot}`
                                        : "-"}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    {p.amount} {p.currency.toUpperCase()}
                                </td>
                                <td className="px-4 py-3 font-mono text-xs" title={p.stripeSessionId}>
                                    {p.stripeSessionId.slice(0, 14)}...
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge value={p.status} />
                                </td>
                                <td className="px-4 py-3">{fmtDate(p.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}