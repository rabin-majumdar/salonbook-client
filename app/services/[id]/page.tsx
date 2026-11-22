"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/types/service";
import { BookingForm } from "@/components/services/booking-form";

type Result = { id: string; service: Service | null; error: string };

export default function ServiceDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [result, setResult] = useState<Result | null>(null);

    const loading = !result || result.id !== id;

    useEffect(() => {
        if (!isPending && !session) {
            router.replace(`/sign-in?redirect=/services/${id}`);
        }
    }, [isPending, session, router, id]);

    useEffect(() => {
        if (!session) return;
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
    }, [id, session]);

    if (isPending || !session || loading) {
        return (
            <div className="mx-auto max-w-5xl animate-pulse px-4 py-10">
                <div className="h-80 rounded-2xl bg-muted" />
                <div className="mt-6 h-6 w-1/3 rounded bg-muted" />
            </div>
        );
    }

    const service = result.service;
    if (result.error || !service) {
        return (
            <div className="mx-auto max-w-xl px-4 py-20 text-center">
                <h1 className="text-2xl font-bold">Service unavailable</h1>
                <p className="mt-2 text-muted-foreground">
                    {result.error || "Service not found"}
                </p>
                <Link href="/services" className="mt-6 inline-block underline">
                    Back to services
                </Link>
            </div>
        );
    }

    const isAdmin = session.user.role === "admin";
    const isActive = service.status === "active";

    return (
        <>
            <div className="mx-auto max-w-5xl px-4 pt-6">
                <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to services
                </Link>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 px-4 py-6 lg:grid-cols-2">
                <div className="relative h-80 w-full overflow-hidden rounded-2xl lg:h-full lg:min-h-96">
                    <Image
                        src={service.image}
                        alt={service.serviceName}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="space-y-5">
                    <div>
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                            {service.category}
                        </span>
                        <h1 className="mt-3 text-3xl font-bold">{service.serviceName}</h1>
                    </div>

                    <p className="text-muted-foreground">{service.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border bg-card p-4">
                            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Tag className="size-4" /> Price
                            </p>
                            <p className="mt-1 text-2xl font-bold text-primary">
                                ৳{service.price}
                            </p>
                        </div>
                        <div className="rounded-xl border bg-card p-4">
                            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Clock className="size-4" /> Duration
                            </p>
                            <p className="mt-1 text-2xl font-bold">{service.duration} min</p>
                        </div>
                    </div>

                    {isAdmin ? (
                        <p className="rounded-lg border p-4 text-sm">
                            Admin accounts cannot book appointments.
                        </p>
                    ) : !isActive ? (
                        <p className="rounded-lg border p-4 text-sm">
                            This service is currently unavailable for booking.
                        </p>
                    ) : (
                        <BookingForm serviceId={service._id} />
                    )}
                </div>
            </div>
        </>
    );
}