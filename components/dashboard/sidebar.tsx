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
        <aside className="md:w-60 md:shrink-0">
            <p className="mb-3 hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground md:block">
                {title}
            </p>
            <nav className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${isActive(item.href)
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}