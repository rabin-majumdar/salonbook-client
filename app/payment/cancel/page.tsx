import Link from "next/link";

export default function PaymentCancelPage() {
    return (
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
            <h1 className="text-2xl font-bold">Payment cancelled</h1>
            <p className="mt-2 text-muted-foreground">
                You left the payment page. No money was taken, and your appointment is
                still waiting for payment.
            </p>
            <Link
                href="/dashboard/customer/appointments"
                className="mt-6 inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
                Back to My Appointments
            </Link>
        </div>
    );
}