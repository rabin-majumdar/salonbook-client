import {
    Scissors,
    CalendarCheck,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const WHY_US = [
    {
        step: "01",
        title: "Expert Stylists",
        text: "Trained professionals dedicated to bringing out your best look.",
        icon: Scissors,
    },
    {
        step: "02",
        title: "Easy Booking",
        text: "Book your favorite salon service quickly and effortlessly.",
        icon: CalendarCheck,
    },
    {
        step: "03",
        title: "Secure Payment",
        text: "Enjoy safe and hassle-free online payment experiences.",
        icon: ShieldCheck,
    },
    {
        step: "04",
        title: "Clean & Relaxing",
        text: "A hygienic and welcoming space for your beauty experience.",
        icon: Sparkles,
    },
];

export function WhyChooseUs() {
    return (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <div>
                <h2 className="text-2xl font-bold">Why Choose SalonBook</h2>
                <p className="mt-1 text-muted-foreground">
                    Discover what makes your salon experience special.
                </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {WHY_US.map((item) => {
                    const Icon = item.icon;
                    return (
                        <article
                            key={item.title}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-linear-to-b from-card to-card/60 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-linear-to-r from-primary/40 via-primary to-primary/40 transition-transform duration-300 group-hover:scale-x-100"
                            />
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
                                        <Icon
                                            className="size-5"
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground/60 transition-colors group-hover:text-primary">
                                        {item.step}
                                    </span>
                                </div>

                                <h3 className="mt-6 text-lg font-semibold tracking-tight text-card-foreground">
                                    {item.title}
                                </h3>

                                <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                                    {item.text}
                                </p>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}