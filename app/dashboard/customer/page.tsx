"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { StatCard } from "@/components/dashboard/stat-card";

type Stats = {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
};

export default function CustomerOverviewPage() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        apiFetch<Stats>("/api/stats/customer", { auth: true })
            .then(setStats)
            .catch((e) => toast.error(e.message));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold">Overview</h1>
            <p className="mt-1 text-muted-foreground">
                A quick summary of your appointment requests.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <StatCard label="Total Appointment Requests" value={stats?.total} />
                <StatCard label="Pending Appointments" value={stats?.pending} />
                <StatCard label="Confirmed Appointments" value={stats?.confirmed} />
                <StatCard label="Cancelled Appointments" value={stats?.cancelled} />
            </div>
        </div>
    );
}