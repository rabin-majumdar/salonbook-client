"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { todayLocal } from "@/lib/format";
import { TIME_SLOTS } from "@/constants/time-slots";
import type { Appointment } from "@/types/appointment";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";

type Stats = {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
};

type Data = {
    stats: Stats;
    next: Appointment | null;
    recent: Appointment[];
};

const slotIndex = (slot: string) =>
    (TIME_SLOTS as readonly string[]).indexOf(slot);

export default function CustomerOverviewPage() {
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        Promise.all([
            apiFetch<Stats>("/api/stats/customer", { auth: true }),
            apiFetch<Appointment[]>("/api/appointments/my", { auth: true }),
        ])
            .then(([stats, items]) => {
                const today = todayLocal();
                const next =
                    items
                        .filter((a) => a.status !== "cancelled" && a.appointmentDate >= today)
                        .sort(
                            (a, b) =>
                                a.appointmentDate.localeCompare(b.appointmentDate) ||
                                slotIndex(a.timeSlot) - slotIndex(b.timeSlot)
                        )[0] ?? null;
                setData({ stats, next, recent: items.slice(0, 3) });
            })
            .catch((e) => toast.error(e.message));
    }, []);

    const stats = data?.stats;
    const next = data?.next;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Overview</h1>
                <p className="mt-1 text-muted-foreground">
                    A quick summary of your appointment requests.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <StatCard label="Total Appointment Requests" value={stats?.total} />
                <StatCard label="Pending Appointments" value={stats?.pending} />
                <StatCard label="Confirmed Appointments" value={stats?.confirmed} />
                <StatCard label="Cancelled Appointments" value={stats?.cancelled} />
            </div>

            <section>
                <h2 className="text-lg font-semibold">Your next appointment</h2>
                {!data ? (
                    <div className="mt-3 h-32 animate-pulse rounded-2xl bg-muted" />
                ) : next ? (
                    <div className="mt-3 flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
                        <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:w-40">
                            <Image
                                src={next.serviceId?.image || "/hero.png"}
                                alt={next.serviceId?.serviceName || "Service"}
                                fill
                                sizes="160px"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <p className="text-lg font-semibold">
                                {next.serviceId?.serviceName || "Service removed"}
                            </p>
                            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <CalendarDays className="size-4" />
                                    {next.appointmentDate}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="size-4" />
                                    {next.timeSlot}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <StatusBadge value={next.status} />
                                <StatusBadge value={next.paymentStatus} />
                            </div>
                        </div>
                        <Link
                            href="/dashboard/customer/appointments"
                            className="inline-flex h-9 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-muted"
                        >
                            Manage
                        </Link>
                    </div>
                ) : (
                    <div className="mt-3 rounded-2xl border bg-card p-6 text-center">
                        <p className="text-muted-foreground">
                            You have no upcoming appointments.
                        </p>
                        <Link
                            href="/services"
                            className="mt-4 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
                        >
                            Browse Services
                        </Link>
                    </div>
                )}
            </section>

            {data && data.recent.length > 0 && (
                <section>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Recent requests</h2>
                        <Link
                            href="/dashboard/customer/appointments"
                            className="text-sm underline"
                        >
                            View all
                        </Link>
                    </div>
                    <ul className="mt-3 divide-y rounded-2xl border bg-card">
                        {data.recent.map((a) => (
                            <li
                                key={a._id}
                                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                            >
                                <div>
                                    <p className="font-medium">
                                        {a.serviceId?.serviceName || "Service removed"}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {a.appointmentDate} · {a.timeSlot}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <StatusBadge value={a.status} />
                                    <StatusBadge value={a.paymentStatus} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}