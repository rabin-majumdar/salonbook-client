"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    async function handleLogout() {
        await authClient.signOut();
        setProfileOpen(false);
        toast.success("Logged out");
        router.push("/");
        router.refresh();
    }

    const link = "text-sm font-medium hover:underline";

    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    SalonBook
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    <Link href="/" className={link}>Home</Link>
                    <Link href="/services" className={link}>Browse Services</Link>
                    {!isPending && !session && (
                        <>
                            <Link href="/sign-in" className={link}>Sign In</Link>
                            <Link href="/sign-up" className={link}>Sign Up</Link>
                        </>
                    )}
                    {session && (
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen((v) => !v)}
                                className="flex items-center gap-2 text-sm font-medium"
                            >
                                {session.user.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={session.user.image} alt="" referrerPolicy="no-referrer" className="size-8 rounded-full object-cover" />
                                ) : (
                                    <span className="flex size-8 items-center justify-center rounded-full bg-muted">
                                        {session.user.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                                {session.user.name}
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-44 rounded-lg border bg-background p-1 shadow-md">
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setProfileOpen(false)}
                                        className="block rounded px-3 py-2 text-sm hover:bg-muted"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-muted"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                <button
                    className="md:hidden"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    ☰
                </button>
            </div>

            {menuOpen && (
                <div className="space-y-2 border-t px-4 py-3 md:hidden">
                    <Link href="/" onClick={() => setMenuOpen(false)} className="block text-sm">Home</Link>
                    <Link href="/services" onClick={() => setMenuOpen(false)} className="block text-sm">Browse Services</Link>
                    {!session ? (
                        <>
                            <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="block text-sm">Sign In</Link>
                            <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="block text-sm">Sign Up</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block text-sm">Dashboard</Link>
                            <button onClick={handleLogout} className="block text-sm">Logout</button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}