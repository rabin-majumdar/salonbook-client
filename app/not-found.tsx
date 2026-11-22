import Link from "next/link";

export default function NotFound() {
    return (
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
            <p className="text-5xl font-bold">404</p>
            <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
            <p className="mt-2 text-muted-foreground">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link
                href="/"
                className="mt-6 inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
                Back to Home
            </Link>
        </div>
    );
}