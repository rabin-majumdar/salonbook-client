import Link from "next/link";

export function Footer() {
    return (
        <footer className="mt-16 border-t bg-muted/40">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <p className="text-lg font-bold">SalonBook</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Book your favourite salon services online, quickly and securely.
                    </p>
                </div>
                <div>
                    <p className="font-semibold">Quick Links</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/services">Browse Services</Link></li>
                        <li><Link href="/sign-in">Sign In</Link></li>
                        <li><Link href="/sign-up">Sign Up</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="font-semibold">Contact</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li>Phone: +880 1700-000000</li>
                        <li>Email: hello@salonbook.com</li>
                        <li>House 12, Road 5, Dhanmondi, Dhaka</li>
                    </ul>
                </div>
                <div>
                    <p className="font-semibold">Opening Hours</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li>Sat - Thu: 9:00 AM - 8:00 PM</li>
                        <li>Friday: 3:00 PM - 9:00 PM</li>
                    </ul>
                    <div className="mt-3 flex gap-3 text-sm">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                        <a href="https://x.com" target="_blank" rel="noreferrer">X</a>
                    </div>
                </div>
            </div>
            <p className="border-t py-4 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} SalonBook. All rights reserved.
            </p>
        </footer>
    );
}