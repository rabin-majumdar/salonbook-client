"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardIndexPage() {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (!session) return;
        router.replace(
            session.user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer"
        );
    }, [session, router]);

    return <p className="text-muted-foreground">Loading your dashboard...</p>;
}