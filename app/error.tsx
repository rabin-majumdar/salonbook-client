"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <TriangleAlert className="size-7" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-muted-foreground">
                An unexpected error occurred while loading this page. You can try again
                or go back to the home page.
            </p>
            <div className="mt-6 flex justify-center gap-3">
                <button
                    type="button"
                    onClick={reset}
                    className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="inline-flex h-10 items-center rounded-lg border px-5 text-sm font-medium hover:bg-accent"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}