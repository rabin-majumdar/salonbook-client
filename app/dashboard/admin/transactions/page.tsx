"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { fmtDate } from "@/lib/format";
import type { Transaction } from "@/types/transaction";
import { StatusBadge } from "@/components/dashboard/status-badge";

export default function TransactionsPage() {
    const [items, setItems] = useState<Transaction[] | null>(null);

    useEffect(() => {
        apiFetch<Transaction[]>("/api/payments/admin/all", { auth: true })
            .then(setItems)
            .catch((e) => {
                toast.error(e.message);
                setItems([]);
            });
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="mt-1 text-muted-foreground">
                Payments recorded from verified Stripe events.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border">
                <table className="w-full min-w-4xl text-left text-sm">
                    <thead className="border-b bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">Customer</th>
                            <th className="px-4 py-3 font-medium">Service</th>
                            <th className="px-4 py-3 font-medium">Appointment</th>
                            <th className="px-4 py-3 font-medium">Amount</th>
                            <th className="px-4 py-3 font-medium">Stripe Session</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items === null && (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                    Loading transactions...
                                </td>
                            </tr>
                        )}
                        {items?.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                    No transactions yet.
                                </td>
                            </tr>
                        )}
                        {items?.map((t) => (
                            <tr key={t._id} className="border-b last:border-0">
                                <td className="px-4 py-3">
                                    <p className="font-medium">{t.customer?.name || "Unknown"}</p>
                                    <p className="text-xs text-muted-foreground">{t.customer?.email}</p>
                                </td>
                                <td className="px-4 py-3">
                                    {t.appointmentId?.serviceId?.serviceName || "Service removed"}
                                </td>
                                <td className="px-4 py-3">
                                    {t.appointmentId
                                        ? `${t.appointmentId.appointmentDate}, ${t.appointmentId.timeSlot}`
                                        : "-"}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    {t.amount} {t.currency.toUpperCase()}
                                </td>
                                <td className="px-4 py-3 font-mono text-xs" title={t.stripeSessionId}>
                                    {t.stripeSessionId.slice(0, 14)}...
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge value={t.status} />
                                </td>
                                <td className="px-4 py-3">{fmtDate(t.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}