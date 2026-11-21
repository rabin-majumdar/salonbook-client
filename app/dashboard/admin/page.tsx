"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { StatCard } from "@/components/dashboard/stat-card";

type Stats = {
    totalCustomers: number;
    activeServices: number;
    totalAppointments: number;
    pending: number;
    confirmed: number;
    successfulPayments: number;
};

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        apiFetch<Stats>("/api/stats/admin", { auth: true })
            .then(setStats)
            .catch((e) => toast.error(e.message));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold">Overview</h1>
            <p className="mt-1 text-muted-foreground">
                Salon activity at a glance.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard label="Registered Customers" value={stats?.totalCustomers} />
                <StatCard label="Active Services" value={stats?.activeServices} />
                <StatCard label="Total Appointment Requests" value={stats?.totalAppointments} />
                <StatCard label="Pending Appointments" value={stats?.pending} />
                <StatCard label="Confirmed Appointments" value={stats?.confirmed} />
                <StatCard label="Successful Payments" value={stats?.successfulPayments} />
            </div>
        </div>
    );
}