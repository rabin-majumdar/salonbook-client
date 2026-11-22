"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/constants/categories";
import type { Service } from "@/types/service";
import {
    ServiceCard,
    ServiceCardSkeleton,
} from "@/components/services/service-card";

const PAGE_SIZE = 9;

const fieldClass =
    "h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function BrowseServices() {
    const params = useSearchParams();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(params.get("category") || "");
    const [sort, setSort] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [visible, setVisible] = useState(PAGE_SIZE);
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

    const hasFilters = !!(search || category || sort);

    function clearFilters() {
        setSearch("");
        setCategory("");
        setSort("");
        setVisible(PAGE_SIZE);
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <h1 className="text-3xl font-bold">Browse Services</h1>
            <p className="mt-1 text-muted-foreground">
                Find the perfect treatment for you.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setVisible(PAGE_SIZE);
                        }}
                        placeholder="Search by service name"
                        className={`${fieldClass} pl-10`}
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setVisible(PAGE_SIZE);
                    }}
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
                    onChange={(e) => {
                        setSort(e.target.value);
                        setVisible(PAGE_SIZE);
                    }}
                    className={fieldClass}
                >
                    <option value="">Sort by price</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>

            <div className="mt-4 flex min-h-8 flex-wrap items-center justify-between gap-2 text-sm">
                <p className="text-muted-foreground">
                    {loading
                        ? "Loading services..."
                        : error
                            ? ""
                            : `${services.length} ${services.length === 1 ? "service" : "services"} found`}
                </p>
                {hasFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition hover:bg-accent"
                    >
                        <X className="size-3.5" />
                        Clear filters
                    </button>
                )}
            </div>

            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading &&
                    Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
                {!loading && error && (
                    <p className="col-span-full text-destructive">{error}</p>
                )}
                {!loading && !error && services.length === 0 && (
                    <p className="col-span-full rounded-2xl border bg-card p-8 text-center text-muted-foreground">
                        No services found. Try a different search or category.
                    </p>
                )}
                {!loading &&
                    services
                        .slice(0, visible)
                        .map((s) => <ServiceCard key={s._id} service={s} />)}
            </div>

            {!loading && !error && visible < services.length && (
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={() => setVisible((v) => v + PAGE_SIZE)}
                        className="inline-flex h-10 items-center rounded-lg border px-6 text-sm font-medium transition hover:bg-accent"
                    >
                        Load more ({services.length - visible} remaining)
                    </button>
                </div>
            )}
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