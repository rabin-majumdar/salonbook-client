"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ADMIN_NAV, CUSTOMER_NAV } from "@/constants/dashboard-nav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();

    const role = session?.user.role === "admin" ? "admin" : "customer";
    const inAdminArea = pathname.startsWith("/dashboard/admin");
    const inCustomerArea = pathname.startsWith("/dashboard/customer");
    const wrongArea =
        !!session &&
        ((inAdminArea && role !== "admin") || (inCustomerArea && role !== "customer"));

    useEffect(() => {
        if (isPending) return;
        if (!session) {
            router.replace("/sign-in?redirect=/dashboard");
        } else if (wrongArea) {
            router.replace("/dashboard");
        }
    }, [isPending, session, wrongArea, router]);

    if (isPending || !session || wrongArea) {
        return (
            <div className="mx-auto max-w-6xl animate-pulse px-4 py-10">
                <div className="h-8 w-1/3 rounded bg-muted" />
                <div className="mt-6 h-64 rounded-2xl bg-muted" />
            </div>
        );
    }

    if (session.user.isBlocked) {
        return (
            <div className="mx-auto max-w-lg px-4 py-24 text-center">
                <h1 className="text-2xl font-bold">Account blocked</h1>
                <p className="mt-2 text-muted-foreground">
                    Your account has been blocked by an administrator. Please contact the
                    salon for help.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-8">
            <Sidebar
                items={role === "admin" ? ADMIN_NAV : CUSTOMER_NAV}
                title={role === "admin" ? "Admin Dashboard" : "Customer Dashboard"}
            />
            <section className="min-w-0 flex-1">{children}</section>
        </div>
    );
}