import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    Brush,
    Flower2,
    Hand,
    Leaf,
    Palette,
    Scissors,
    Sparkles,
    type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/constants/categories";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    "Haircut & Styling": Scissors,
    "Hair Coloring": Palette,
    "Hair Treatment": Sparkles,
    "Facial & Skincare": Flower2,
    Makeup: Brush,
    "Manicure & Pedicure": Hand,
    "Spa & Massage": Leaf,
};

export function ServiceCategories() {
    return (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <h2 className="text-2xl font-bold">
                        Service Categories
                    </h2>
                    <p className="mt-1 text-muted-foreground">
                        Find the right treatment for you.
                    </p>
                </div>

                <Link
                    href="/services"
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                    <span>Explore all services</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
            </div>

            {/* Category Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {CATEGORIES.map((category) => {
                    const Icon = CATEGORY_ICONS[category] ?? Sparkles;

                    return (
                        <Link
                            key={category}
                            href={`/services?category=${encodeURIComponent(category)}`}
                            className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card to-muted/30 p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                        >
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
                                <Icon
                                    className="size-5 transition-transform duration-300 group-hover:rotate-3"
                                    aria-hidden="true"
                                />
                            </span>

                            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-card-foreground transition-colors group-hover:text-primary sm:text-[15px]">
                                {category}
                            </span>

                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted/70 text-muted-foreground transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                                <ArrowUpRight
                                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    aria-hidden="true"
                                />
                            </span>
                        </Link>
                    );
                })}
                <Link
                    href="/services"
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-dashed border-primary/35 bg-primary/5 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary/10"
                >
                    <div>
                        <p className="text-sm font-semibold text-primary">
                            View Full Menu
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Browse all treatments & packages
                        </p>
                    </div>
                    <ArrowRight
                        className="size-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                    />
                </Link>
            </div>
        </section>
    );
}