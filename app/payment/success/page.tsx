"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type PaymentState = {
    status: "processing" | "paid" | "failed";
    amount?: number;
    currency?: string;
};

function SuccessContent() {
    const sessionId = useSearchParams().get("session_id");
    const [state, setState] = useState<PaymentState>({ status: "processing" });
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (!sessionId) return;
        let cancelled = false;
        let attempts = 0;
        let timer: ReturnType<typeof setTimeout>;

        async function check() {
            try {
                const r = await apiFetch<PaymentState>(
                    `/api/payments/session/${sessionId}`,
                    { auth: true }
                );
                if (cancelled) return;
                if (r.status !== "processing") {
                    setState(r);
                    return;
                }
            } catch {
            }
            attempts += 1;
            if (attempts >= 10) {
                if (!cancelled) setTimedOut(true);
                return;
            }
            timer = setTimeout(check, 2000);
        }

        check();
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [sessionId]);

    const box = "mx-auto max-w-lg px-4 py-20 text-center";
    const btn =
        "mt-6 inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90";

    if (!sessionId) {
        return (
            <div className={box}>
                <h1 className="text-2xl font-bold">Nothing to show</h1>
                <p className="mt-2 text-muted-foreground">
                    No payment session was found.
                </p>
                <Link href="/dashboard/customer/appointments" className={btn}>
                    My Appointments
                </Link>
            </div>
        );
    }

    if (state.status === "paid") {
        return (
            <div className={box}>
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
                    ✓
                </div>
                <h1 className="mt-4 text-2xl font-bold">Payment successful</h1>
                <p className="mt-2 text-muted-foreground">
                    We received {state.amount} {state.currency?.toUpperCase()}. Your
                    appointment is paid and confirmed.
                </p>
                <Link href="/dashboard/customer/appointments" className={btn}>
                    View My Appointments
                </Link>
            </div>
        );
    }

    if (state.status === "failed") {
        return (
            <div className={box}>
                <h1 className="text-2xl font-bold">Payment failed</h1>
                <p className="mt-2 text-muted-foreground">
                    The payment could not be completed. You can try again.
                </p>
                <Link href="/dashboard/customer/appointments" className={btn}>
                    Back to My Appointments
                </Link>
            </div>
        );
    }

    return (
        <div className={box}>
            <h1 className="text-2xl font-bold">
                {timedOut ? "Still confirming your payment" : "Confirming your payment..."}
            </h1>
            <p className="mt-2 text-muted-foreground">
                {timedOut
                    ? "This is taking longer than usual. Check My Appointments in a minute, the status will update once Stripe confirms."
                    : "Please wait a moment while we verify your payment."}
            </p>
            <Link href="/dashboard/customer/appointments" className={btn}>
                My Appointments
            </Link>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={null}>
            <SuccessContent />
        </Suspense>
    );
}