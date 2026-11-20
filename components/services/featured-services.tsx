"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/types/service";
import { ServiceCard, ServiceCardSkeleton } from "./service-card";

export function FeaturedServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        apiFetch<Service[]>("/api/services?limit=6")
            .then(setServices)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl font-bold">Featured Services</h2>
            <p className="mt-1 text-muted-foreground">Our most popular treatments.</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading &&
                    Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
                {!loading && error && (
                    <p className="col-span-full text-destructive">{error}</p>
                )}
                {!loading && !error && services.length === 0 && (
                    <p className="col-span-full text-muted-foreground">
                        No services available right now.
                    </p>
                )}
                {services.map((s) => (
                    <ServiceCard key={s._id} service={s} />
                ))}
            </div>
        </section>
    );
}