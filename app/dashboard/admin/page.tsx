"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { AdminAppointment } from "@/types/appointment";
import type { Transaction } from "@/types/transaction";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
    AdminCharts,
    type ServiceDatum,
    type StatusDatum,
} from "@/components/dashboard/admin-charts";

type Stats = {
    totalCustomers: number;
    activeServices: number;
    totalAppointments: number;
    pending: number;
    confirmed: number;
    successfulPayments: number;
};

type Data = {
    stats: Stats;
    recent: AdminAppointment[];
    status: StatusDatum[];
    services: ServiceDatum[];
    revenue: number;
    currency: string;
};

export default function AdminOverviewPage() {
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        Promise.all([
            apiFetch<Stats>("/api/stats/admin", { auth: true }),
            apiFetch<AdminAppointment[]>("/api/appointments/admin/all", { auth: true }),
            apiFetch<Transaction[]>("/api/payments/admin/all", { auth: true }),
        ])
            .then(([stats, items, transactions]) => {
                const count = (s: string) => items.filter((a) => a.status === s).length;
                const status: StatusDatum[] = [
                    { name: "Pending", value: count("pending"), color: "#eab308" },
                    { name: "Confirmed", value: count("confirmed"), color: "#22c55e" },
                    { name: "Cancelled", value: count("cancelled"), color: "#ef4444" },
                ];

                const byService = new Map<string, number>();
                items
                    .filter((a) => a.status !== "cancelled")
                    .forEach((a) => {
                        const name = a.serviceId?.serviceName || "Service removed";
                        byService.set(name, (byService.get(name) || 0) + 1);
                    });
                const services: ServiceDatum[] = [...byService.entries()]
                    .map(([name, bookings]) => ({ name, bookings }))
                    .sort((a, b) => b.bookings - a.bookings)
                    .slice(0, 5);

                const paid = transactions.filter((t) => t.status === "paid");
                const revenue = paid.reduce((sum, t) => sum + t.amount, 0);
                const currency = (paid[0]?.currency || "bdt").toUpperCase();

                setData({
                    stats,
                    recent: items.slice(0, 5),
                    status,
                    services,
                    revenue,
                    currency,
                });
            })
            .catch((e) => toast.error(e.message));
    }, []);

    const stats = data?.stats;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Overview</h1>
                <p className="mt-1 text-muted-foreground">Salon activity at a glance.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard label="Registered Customers" value={stats?.totalCustomers} />
                <StatCard label="Active Services" value={stats?.activeServices} />
                <StatCard label="Total Appointment Requests" value={stats?.totalAppointments} />
                <StatCard label="Pending Appointments" value={stats?.pending} />
                <StatCard label="Confirmed Appointments" value={stats?.confirmed} />
                <StatCard label="Successful Payments" value={stats?.successfulPayments} />
            </div>

            <div className="rounded-2xl border bg-card p-5">
                <p className="text-sm text-muted-foreground">
                    Total revenue (verified Stripe payments)
                </p>
                {data ? (
                    <p className="mt-2 text-3xl font-bold text-primary">
                        {data.revenue.toLocaleString()} {data.currency}
                    </p>
                ) : (
                    <div className="mt-3 h-8 w-40 animate-pulse rounded bg-muted" />
                )}
            </div>

            {data ? (
                <AdminCharts status={data.status} services={data.services} />
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="h-80 animate-pulse rounded-2xl bg-muted" />
                    <div className="h-80 animate-pulse rounded-2xl bg-muted" />
                </div>
            )}

            <section>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Latest appointment requests</h2>
                    <Link href="/dashboard/admin/appointments" className="text-sm underline">
                        View all
                    </Link>
                </div>

                {!data ? (
                    <div className="mt-3 h-40 animate-pulse rounded-2xl bg-muted" />
                ) : data.recent.length === 0 ? (
                    <p className="mt-3 rounded-2xl border bg-card p-6 text-muted-foreground">
                        No appointment requests yet.
                    </p>
                ) : (
                    <ul className="mt-3 divide-y rounded-2xl border bg-card">
                        {data.recent.map((a) => (
                            <li
                                key={a._id}
                                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
                            >
                                <div>
                                    <p className="font-medium">{a.customer?.name || "Unknown"}</p>
                                    <p className="text-muted-foreground">
                                        {a.serviceId?.serviceName || "Service removed"} ·{" "}
                                        {a.appointmentDate}, {a.timeSlot}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <StatusBadge value={a.status} />
                                    <StatusBadge value={a.paymentStatus} />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}