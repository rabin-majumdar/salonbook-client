"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/constants/dashboard-nav";

export function Sidebar({ items, title }: { items: NavItem[]; title: string }) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        const isRoot = items.every(
            (other) => other.href === href || !other.href.startsWith(href + "/")
        );
        return isRoot
            ? pathname === href || pathname.startsWith(href + "/")
            : pathname === href;
    };

    return (
        <aside className="md:w-64 md:shrink-0">
            <p className="mb-3 hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground md:block">
                {title}
            </p>
            <nav className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
                {items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition ${active
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                }`}
                        >
                            <Icon className="size-4 shrink-0" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}