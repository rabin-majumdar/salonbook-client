"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/constants/categories";
import type { Service } from "@/types/service";
import { ServiceCard, ServiceCardSkeleton } from "@/components/services/service-card";

const fieldClass =
    "h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function BrowseServices() {
    const params = useSearchParams();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(params.get("category") || "");
    const [sort, setSort] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            const query = new URLSearchParams();
            if (search.trim()) query.set("search", search.trim());
            if (category) query.set("category", category);
            if (sort) query.set("sort", sort);

            setLoading(true);
            setError("");
            apiFetch<Service[]>(`/api/services?${query.toString()}`)
                .then(setServices)
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(timer);
    }, [search, category, sort]);

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <h1 className="text-3xl font-bold">Browse Services</h1>
            <p className="mt-1 text-muted-foreground">
                Find the perfect treatment for you.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by service name"
                    className={fieldClass}
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={fieldClass}
                >
                    <option value="">All categories</option>
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className={fieldClass}
                >
                    <option value="">Sort by price</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading &&
                    Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
                {!loading && error && (
                    <p className="col-span-full text-destructive">{error}</p>
                )}
                {!loading && !error && services.length === 0 && (
                    <p className="col-span-full text-muted-foreground">
                        No services found. Try a different search or category.
                    </p>
                )}
                {!loading &&
                    services.map((s) => <ServiceCard key={s._id} service={s} />)}
            </div>
        </div>
    );
}

export default function ServicesPage() {
    return (
        <Suspense fallback={null}>
            <BrowseServices />
        </Suspense>
    );
}