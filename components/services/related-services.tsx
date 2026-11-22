"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/types/service";
import { ServiceCard, ServiceCardSkeleton } from "./service-card";

type Result = { key: string; items: Service[] };

export function RelatedServices({
    category,
    currentId,
}: {
    category: string;
    currentId: string;
}) {
    const key = `${category}:${currentId}`;
    const [result, setResult] = useState<Result | null>(null);
    const loading = !result || result.key !== key;

    useEffect(() => {
        let cancelled = false;

        apiFetch<Service[]>(`/api/services?category=${encodeURIComponent(category)}`)
            .then((list) => {
                if (cancelled) return;
                setResult({
                    key,
                    items: list.filter((s) => s._id !== currentId).slice(0, 3),
                });
            })
            .catch(() => {
                if (!cancelled) setResult({ key, items: [] });
            });

        return () => {
            cancelled = true;
        };
    }, [category, currentId, key]);

    const items = !loading && result ? result.items : null;
    if (items && items.length === 0) return null;

    return (
        <section className="mx-auto max-w-5xl px-4 pb-14 pt-6">
            <h2 className="text-2xl font-bold">You may also like</h2>
            <p className="mt-1 text-muted-foreground">
                More services from {category}.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items === null
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <ServiceCardSkeleton key={i} />
                    ))
                    : items.map((s) => <ServiceCard key={s._id} service={s} />)}
            </div>
        </section>
    );
}