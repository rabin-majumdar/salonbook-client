"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { NavItem } from "@/constants/dashboard-nav";

export function Sidebar({ items, title }: { items: NavItem[]; title: string }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const current =
        items
            .filter(
                (i) => pathname === i.href || pathname.startsWith(i.href + "/")
            )
            .sort((a, b) => b.href.length - a.href.length)[0] ?? items[0];
    const CurrentIcon = current.icon;

    const linkClass = (active: boolean) =>
        `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`;

    return (
        <aside className="md:w-64 md:shrink-0">
            <div className="md:hidden">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between rounded-xl border bg-card px-4 py-3 text-sm font-medium shadow-sm"
                >
                    <span className="flex items-center gap-2.5">
                        <CurrentIcon className="size-4 text-primary" />
                        {current.label}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        Menu
                        <ChevronDown
                            className={`size-4 transition ${open ? "rotate-180" : ""}`}
                        />
                    </span>
                </button>

                {open && (
                    <nav className="mt-2 grid gap-1 rounded-xl border bg-card p-2 shadow-md">
                        {items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={linkClass(item.href === current.href)}
                                >
                                    <Icon className="size-4 shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </div>
            <div className="hidden md:block">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {title}
                </p>
                <nav className="flex flex-col gap-2">
                    {items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={linkClass(item.href === current.href)}
                            >
                                <Icon className="size-4 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}