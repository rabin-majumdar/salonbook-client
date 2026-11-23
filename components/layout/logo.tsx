import Image from "next/image";
import Link from "next/link";

export function LogoMark({ className }: { className?: string }) {
    return (
        <Image
            src="/logo.png"
            alt="SalonBook logo"
            width={80}
            height={80}
            priority
            className={`rounded-xl object-contain ${className ?? ""}`}
        />
    );
}

export function Logo({ className = "" }: { className?: string }) {
    return (
        <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
            <LogoMark className="size-9" />
            <span className="text-xl font-bold tracking-tight">
                Salon<span className="text-primary">Book</span>
            </span>
        </Link>
    );
}