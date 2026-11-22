import Link from "next/link";
import { ChevronRight, Clock, Mail, MapPin, Phone, Scissors } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
        </svg>
    );
}

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

const QUICK_LINKS = [
    { label: "Home", href: "/" },
    { label: "Browse Services", href: "/services" },
    { label: "Sign In", href: "/sign-in" },
    { label: "Sign Up", href: "/sign-up" },
];

const SOCIALS = [
    { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
    { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
    { label: "X", href: "https://x.com", icon: XIcon },
];

export function Footer() {
    return (
        <footer className="mt-16 border-t bg-accent/40">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <Scissors className="size-5" />
                        </span>
                        <span className="text-xl font-bold tracking-tight">SalonBook</span>
                    </Link>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        Book your favourite salon services online, quickly and securely.
                        Look good, feel great.
                    </p>
                    <div className="mt-5 flex gap-3">
                        {SOCIALS.map(({ label, href, icon: Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={label}
                                className="flex size-9 items-center justify-center rounded-full border bg-background text-muted-foreground transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
                            >
                                <Icon className="size-4" />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="font-semibold">Quick Links</p>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        {QUICK_LINKS.map((l) => (
                            <li key={l.href}>
                                <Link
                                    href={l.href}
                                    className="group inline-flex items-center gap-1 text-muted-foreground transition hover:text-primary"
                                >
                                    <ChevronRight className="size-3.5 transition group-hover:translate-x-0.5" />
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className="font-semibold">Contact Us</p>
                    <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-3">
                            <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span>+880 1700-000000</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span>hello@salonbook.com</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span>House 12, Road 5, Dhanmondi, Dhaka</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="font-semibold">Opening Hours</p>
                    <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-3">
                            <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                            <div>
                                <p className="font-medium text-foreground">Saturday - Thursday</p>
                                <p>9:00 AM - 8:00 PM</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                            <div>
                                <p className="font-medium text-foreground">Friday</p>
                                <p>3:00 PM - 9:00 PM</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row">
                    <p>© {new Date().getFullYear()} SalonBook. All rights reserved.</p>
                    <p>Made with care for your best look.</p>
                </div>
            </div>
        </footer>
    );
}