import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const HIGHLIGHTS = [
    "Hair Styling",
    "Skincare",
    "Makeup",
    "Spa & Massage",
];

export function Hero() {
    return (
        <section className="relative flex min-h-[75vh] items-center overflow-hidden bg-[#1c1917]">
            <div
                aria-hidden="true"
                className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat transition-transform duration-700"
                style={{ backgroundImage: "url('/hero.png')" }}
            />

            {/* Directional dark + warm gradient overlay for crisp text contrast */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-r from-[#1c1917]/90 via-[#292524]/70 to-[#292524]/35"
            />

            <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
                <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A46D]/40 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wider text-white uppercase backdrop-blur-md sm:text-sm">
                        <Sparkles
                            className="size-4 text-[#C5A46D]"
                            aria-hidden="true"
                        />
                        Your Beauty, Your Way
                    </span>

                    <h1 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
                        Look Good. Feel Great.
                        <span className="mt-1 block bg-linear-to-r from-[#E5B6BD] via-[#F3D2D7] to-[#C5A46D] bg-clip-text text-transparent">
                            Book in Minutes.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-7 text-stone-200/90 sm:text-lg">
                        Discover haircuts, skincare, makeup and spa treatments, and request your appointment online.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3.5">
                        <Link
                            href="/services"
                            className="group inline-flex h-12 items-center gap-2.5 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20 sm:text-base"
                        >
                            <span>Explore Salon Services</span>
                            <ArrowRight
                                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                                aria-hidden="true"
                            />
                        </Link>

                        <Link
                            href="/services?category=Spa%20%26%20Massage"
                            className="inline-flex h-12 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-white/45 hover:bg-white/15 sm:text-base"
                        >
                            Book a Spa Session
                        </Link>
                    </div>

                    <p className="mt-4 flex items-center gap-2 text-xs text-stone-300/90 sm:text-sm">
                        <CheckCircle2
                            className="size-4 shrink-0 text-[#C5A46D]"
                            aria-hidden="true"
                        />
                        <span>
                            Easy online requests • Curated stylists • Transparent
                            pricing
                        </span>
                    </p>

                    <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-white/15 pt-6 text-xs font-medium tracking-wide text-white/85 uppercase sm:text-sm">
                        {HIGHLIGHTS.map((item, idx) => (
                            <span key={item} className="inline-flex items-center gap-5">
                                <span>{item}</span>
                                {idx < HIGHLIGHTS.length - 1 && (
                                    <span
                                        aria-hidden="true"
                                        className="size-1.5 rounded-full bg-[#C5A46D]"
                                    />
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}