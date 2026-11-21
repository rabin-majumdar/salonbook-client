import Link from "next/link";
import type { Service } from "@/types/service";
import Image from "next/image";

export function ServiceCard({ service }: { service: Service }) {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md">
            <div className="relative h-48 w-full">
                <Image
                    src={service.image}
                    alt={service.serviceName}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
                <span className="w-fit rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                    {service.category}
                </span>
                <h3 className="text-lg font-semibold">{service.serviceName}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                    {service.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2 text-sm">
                    <span className="font-semibold">৳{service.price}</span>
                    <span className="text-muted-foreground">{service.duration} min</span>
                </div>
                <Link
                    href={`/services/${service._id}`}
                    className="mt-2 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}

export function ServiceCardSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl border">
            <div className="h-48 bg-muted" />
            <div className="space-y-3 p-4">
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-5 w-2/3 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-9 rounded bg-muted" />
            </div>
        </div>
    );
}