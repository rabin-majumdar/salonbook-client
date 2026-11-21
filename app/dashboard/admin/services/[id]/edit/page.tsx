"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/types/service";
import { ServiceForm } from "@/components/dashboard/service-form";

type Result = { id: string; service: Service | null; error: string };

export default function EditServicePage() {
    const { id } = useParams<{ id: string }>();
    const [result, setResult] = useState<Result | null>(null);
    const loading = !result || result.id !== id;

    useEffect(() => {
        let cancelled = false;
        apiFetch<Service>(`/api/services/${id}`)
            .then((service) => {
                if (!cancelled) setResult({ id, service, error: "" });
            })
            .catch((e) => {
                if (!cancelled) setResult({ id, service: null, error: e.message });
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) {
        return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;
    }

    if (result.error || !result.service) {
        return (
            <div>
                <p className="text-destructive">{result.error || "Service not found"}</p>
                <Link href="/dashboard/admin/services" className="mt-3 inline-block underline">
                    Back to services
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Update Service</h1>
            <p className="mb-6 mt-1 text-muted-foreground">
                Edit details of {result.service.serviceName}.
            </p>
            <ServiceForm initial={result.service} />
        </div>
    );
}