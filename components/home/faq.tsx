import { ChevronDown } from "lucide-react";

const FAQS = [
    {
        q: "How do I book an appointment?",
        a: "Create an account, open any service, choose a date and an available time slot, and send your request. The salon will review it and confirm.",
    },
    {
        q: "When do I pay for my appointment?",
        a: "You pay only after the salon confirms your request. Open My Appointments in your dashboard and press Pay Now to complete the payment securely with Stripe.",
    },
    {
        q: "Can I cancel an appointment?",
        a: "You can cancel your own request while it is still pending. After confirmation, please contact the salon, and an admin can cancel it for you.",
    },
    {
        q: "Is my payment secure?",
        a: "Yes. Payments are processed by Stripe Checkout, and we never see or store your card details. Your payment status updates only after Stripe confirms it.",
    },
    {
        q: "Why can't I see some services?",
        a: "Only active services are shown and available for booking. The salon may temporarily deactivate a service.",
    },
    {
        q: "Do I need an account to browse services?",
        a: "No. Anyone can browse services, search and filter them. You only need to sign in to view service details and send an appointment request.",
    },
];

export function Faq() {
    return (
        <section className="mx-auto max-w-6xl px-4 pb-16">
            <h2 className="text-2xl font-bold">Frequently asked questions</h2>
            <p className="mt-1 text-muted-foreground">
                Quick answers to common questions.
            </p>
            <div className="mt-6 grid items-start gap-3 lg:grid-cols-2">
                {FAQS.map((f) => (
                    <details
                        key={f.q}
                        className="group rounded-xl border bg-card px-5 py-4 open:shadow-sm"
                    >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                            {f.q}
                            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
                        </summary>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {f.a}
                        </p>
                    </details>
                ))}
            </div>
        </section>
    );
}