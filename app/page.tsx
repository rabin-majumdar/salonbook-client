import Link from "next/link";
import { FeaturedServices } from "@/components/services/featured-services";
import { CATEGORIES } from "@/constants/categories";

const WHY_US = [
  { title: "Expert Stylists", text: "Trained professionals for every service." },
  { title: "Easy Booking", text: "Pick a date and time in under a minute." },
  { title: "Secure Payment", text: "Pay safely online once confirmed." },
  { title: "Clean & Relaxing", text: "A hygienic, welcoming salon space." },
];

export default function HomePage() {
  return (
    <>
      <section
        className="relative flex min-h-[70vh] items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.png')" }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-6xl px-4 text-white">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Look good. Feel great. Book in minutes.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            Discover haircuts, skincare, makeup and spa treatments, and request
            your appointment online.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex h-11 items-center rounded-lg bg-white px-6 font-medium text-black hover:bg-white/90"
          >
            Explore Salon Services
          </Link>
        </div>
      </section>

      <FeaturedServices />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-bold">Service Categories</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/services?category=${encodeURIComponent(c)}`}
              className="rounded-2xl border p-5 text-center font-medium transition hover:bg-muted"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold">Why Choose SalonBook</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_US.map((item) => (
            <div key={item.title} className="rounded-2xl border p-5">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
