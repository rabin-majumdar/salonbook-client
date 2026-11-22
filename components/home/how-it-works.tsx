import {
    CalendarCheck,
    Clock,
    CreditCard,
    Search,
    ShieldCheck,
    Sparkles,
    UserPlus,
    type LucideIcon,
} from "lucide-react";

type Step = {
    icon: LucideIcon;
    tag: string;
    tagClass: string;
    title: string;
    text: string;
    meta: string;
    metaIcon: LucideIcon;
};

const STEPS: Step[] = [
    {
        icon: UserPlus,
        tag: "Account",
        tagClass:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
        title: "Create an account",
        text: "Sign up in seconds with your email or your Google account.",
        meta: "Takes under a minute",
        metaIcon: Clock,
    },
    {
        icon: Search,
        tag: "Browse",
        tagClass:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
        title: "Choose a service",
        text: "Browse by category, search by name and compare prices and durations.",
        meta: "Search, filter and sort",
        metaIcon: Sparkles,
    },
    {
        icon: CalendarCheck,
        tag: "Booking",
        tagClass:
            "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
        title: "Pick a date and time",
        text: "Select an available slot and send your appointment request to the salon.",
        meta: "Live slot availability",
        metaIcon: Clock,
    },
    {
        icon: CreditCard,
        tag: "Payment",
        tagClass: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
        title: "Confirm and pay",
        text: "Once the salon confirms your request, pay securely online with Stripe.",
        meta: "Secured by Stripe",
        metaIcon: ShieldCheck,
    },
];

export function HowItWorks() {
    return (
        <section className="mx-auto max-w-5xl px-4 py-16">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                    Simple process
                </p>
                <h2 className="mt-2 text-3xl font-bold">How it works</h2>
                <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                    Four easy steps from browsing to a fresh new look.
                </p>
            </div>

            <ol className="mt-12">
                {STEPS.map((s, i) => {
                    const isLeft = i % 2 === 1;
                    const Icon = s.icon;
                    const MetaIcon = s.metaIcon;

                    return (
                        <li
                            key={s.title}
                            className="relative grid grid-cols-[2.5rem_1fr] gap-x-4 pb-10 last:pb-0 md:grid-cols-[1fr_2.5rem_1fr] md:gap-x-8"
                        >
                            {i < STEPS.length - 1 && (
                                <span
                                    aria-hidden
                                    className="absolute -bottom-5 left-5 top-5 w-px bg-primary/30 md:left-1/2 md:-translate-x-1/2"
                                />
                            )}

                            <div className="relative z-10 col-start-1 row-start-1 flex size-10 items-center justify-center rounded-full border bg-card text-primary shadow-sm ring-8 ring-background md:col-start-2">
                                <Icon className="size-4" />
                            </div>
                            <div
                                className={`col-start-2 row-start-1 ${isLeft ? "md:col-start-1 md:text-right" : "md:col-start-3"
                                    }`}
                            >
                                <div className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                    <div
                                        className={`flex flex-wrap items-center gap-2 ${isLeft ? "md:justify-end" : ""
                                            }`}
                                    >
                                        <span className="text-xs text-muted-foreground">
                                            Step {i + 1}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.tagClass}`}
                                        >
                                            {s.tag}
                                        </span>
                                    </div>
                                    <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                        {s.text}
                                    </p>
                                    <p
                                        className={`mt-4 flex items-center gap-1.5 text-xs text-muted-foreground ${isLeft ? "md:justify-end" : ""
                                            }`}
                                    >
                                        <MetaIcon className="size-3.5" />
                                        {s.meta}
                                    </p>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}