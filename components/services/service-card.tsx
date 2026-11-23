import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Service } from "@/types/service";

export function ServiceCard({ service }: { service: Service }) {
    const formattedPrice =
        typeof service.price === "number"
            ? service.price.toLocaleString("en-BD")
            : service.price;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="relative h-52 w-full overflow-hidden bg-muted">
                <Image
                    src={service.image}
                    alt={service.serviceName}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-black/25"
                />

                <span className="absolute right-3.5 top-3.5 rounded-full border border-border/50 bg-card/95 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-xs backdrop-blur-sm">
                    {service.category}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3
                    title={service.serviceName}
                    className="line-clamp-1 text-lg font-bold tracking-tight text-card-foreground transition-colors group-hover:text-primary"
                >
                    {service.serviceName}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {service.description}
                </p>

                <div className="mt-auto pt-5">
                    <div className="flex items-end justify-between border-t border-border/70 pt-4">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                Starting from
                            </p>
                            <p className="mt-0.5 text-xl font-bold tracking-tight">
                                ৳{formattedPrice}
                            </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground">
                            <Clock3 className="size-3.5" aria-hidden="true" />
                            <span>{service.duration} min</span>
                        </span>
                    </div>
                    <Link
                        href={`/services/${service._id}`}
                        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-xs transition-all duration-300 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        <span>View Details</span>
                        <ArrowUpRight
                            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </Link>
                </div>
            </div>
        </article>
    );
}

export function ServiceCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-border/80 bg-card"
        >
            <div className="h-52 w-full bg-muted" />
            <div className="flex flex-1 flex-col p-5">
                <div className="h-5 w-2/3 rounded-md bg-muted" />
                <div className="mt-3 space-y-2">
                    <div className="h-3.5 w-full rounded bg-muted" />
                    <div className="h-3.5 w-4/5 rounded bg-muted" />
                </div>
                <div className="mt-auto pt-5">
                    <div className="flex items-end justify-between border-t border-border/70 pt-4">
                        <div className="space-y-1.5">
                            <div className="h-3 w-20 rounded bg-muted" />
                            <div className="h-6 w-20 rounded bg-muted" />
                        </div>
                        <div className="h-7 w-20 rounded-full bg-muted" />
                    </div>
                    <div className="mt-4 h-10 w-full rounded-xl bg-muted" />
                </div>
            </div>
        </div>
    );
}