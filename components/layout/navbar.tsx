"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Sun,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Logo } from "@/components/layout/logo";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Browse Services", href: "/services" },
];

function Avatar({ name, image }: { name: string; image?: string | null }) {
    return image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={image}
            alt=""
            referrerPolicy="no-referrer"
            className="size-8 rounded-full object-cover"
        />
    ) : (
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {name.charAt(0).toUpperCase()}
        </span>
    );
}

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { resolvedTheme, setTheme } = useTheme();
    const { data: session, isPending } = authClient.useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (
                profileRef.current &&
                !profileRef.current.contains(e.target as Node)
            ) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    async function handleLogout() {
        await authClient.signOut();
        setProfileOpen(false);
        setMenuOpen(false);
        toast.success("Logged out");
        router.push("/");
        router.refresh();
    }

    return (
        <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">

                <Logo />
                
                <nav className="hidden items-center gap-1 md:flex">
                    {NAV_LINKS.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${isActive(l.href)
                                    ? "bg-accent text-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                        aria-label="Toggle theme"
                        className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition hover:bg-accent hover:text-foreground"
                    >
                        <Sun className="size-4 dark:hidden" />
                        <Moon className="hidden size-4 dark:block" />
                    </button>

                    <div className="hidden items-center gap-2 md:flex">
                        {!isPending && !session && (
                            <>
                                <Link
                                    href="/sign-in"
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}

                        {session && (
                            <div className="relative" ref={profileRef}>
                                <button
                                    type="button"
                                    onClick={() => setProfileOpen((v) => !v)}
                                    className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm font-medium transition hover:bg-accent"
                                >
                                    <Avatar name={session.user.name} image={session.user.image} />
                                    <span className="max-w-28 truncate">{session.user.name}</span>
                                    <ChevronDown
                                        className={`size-4 text-muted-foreground transition ${profileOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border bg-popover p-1 shadow-lg">
                                        <div className="border-b px-3 py-2.5">
                                            <p className="truncate text-sm font-semibold">
                                                {session.user.name}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setProfileOpen(false)}
                                            className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition hover:bg-accent"
                                        >
                                            <LayoutDashboard className="size-4 text-muted-foreground" />
                                            Dashboard
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-accent"
                                        >
                                            <LogOut className="size-4 text-muted-foreground" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="flex size-9 items-center justify-center rounded-lg border md:hidden"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="space-y-1 border-t px-4 py-3 md:hidden">
                    {NAV_LINKS.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setMenuOpen(false)}
                            className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${isActive(l.href) ? "bg-accent" : "text-muted-foreground"
                                }`}
                        >
                            {l.label}
                        </Link>
                    ))}

                    {!isPending && !session && (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <Link
                                href="/sign-in"
                                onClick={() => setMenuOpen(false)}
                                className="inline-flex h-10 items-center justify-center rounded-lg border text-sm font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/sign-up"
                                onClick={() => setMenuOpen(false)}
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {session && (
                        <div className="border-t pt-3">
                            <div className="flex items-center gap-3 px-3 pb-2">
                                <Avatar name={session.user.name} image={session.user.image} />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold">
                                        {session.user.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {session.user.email}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm"
                            >
                                <LayoutDashboard className="size-4" />
                                Dashboard
                            </Link>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm"
                            >
                                <LogOut className="size-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}