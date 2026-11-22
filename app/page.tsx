// import Link from "next/link";
// import {
//   Brush,
//   CalendarCheck,
//   CreditCard,
//   Flower2,
//   Hand,
//   Leaf,
//   Palette,
//   Scissors,
//   Search,
//   Sparkles,
//   type LucideIcon,
// } from "lucide-react";
// import { FeaturedServices } from "@/components/services/featured-services";
// import { CATEGORIES } from "@/constants/categories";
// import { Faq } from "@/components/home/faq";

// const CATEGORY_ICONS: Record<string, LucideIcon> = {
//   "Haircut & Styling": Scissors,
//   "Hair Coloring": Palette,
//   "Hair Treatment": Sparkles,
//   "Facial & Skincare": Flower2,
//   Makeup: Brush,
//   "Manicure & Pedicure": Hand,
//   "Spa & Massage": Leaf,
// };

// const STEPS = [
//   {
//     icon: Search,
//     title: "Choose a service",
//     text: "Browse treatments by category, compare prices and durations.",
//   },
//   {
//     icon: CalendarCheck,
//     title: "Pick a date and time",
//     text: "Send an appointment request and wait for the salon to confirm.",
//   },
//   {
//     icon: CreditCard,
//     title: "Pay securely online",
//     text: "Once confirmed, pay with Stripe and you are all set.",
//   },
// ];

// const WHY_US = [
//   { title: "Expert Stylists", text: "Trained professionals for every service." },
//   { title: "Easy Booking", text: "Pick a date and time in under a minute." },
//   { title: "Secure Payment", text: "Pay safely online once confirmed." },
//   { title: "Clean & Relaxing", text: "A hygienic, welcoming salon space." },
// ];

// export default function HomePage() {
//   return (
//     <>
//       <section
//         className="relative flex min-h-[70vh] items-center bg-cover bg-center"
//         style={{ backgroundImage: "url('/hero.png')" }}
//       >
//         <div className="absolute inset-0 bg-black/55" />
//         <div className="relative mx-auto max-w-6xl px-4 text-white">
//           <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
//             Look good. Feel great. Book in minutes.
//           </h1>
//           <p className="mt-4 max-w-xl text-lg text-white/85">
//             Discover haircuts, skincare, makeup and spa treatments, and request
//             your appointment online.
//           </p>
//           <Link
//             href="/services"
//             className="mt-8 inline-flex h-11 items-center rounded-lg bg-white px-6 font-medium text-black hover:opacity-90"
//           >
//             Explore Salon Services
//           </Link>
//         </div>
//       </section>

//       <FeaturedServices />

//       <section className="mx-auto max-w-6xl px-4 py-10">
//         <h2 className="text-2xl font-bold">Service Categories</h2>
//         <p className="mt-1 text-muted-foreground">
//           Find the right treatment for you.
//         </p>
//         <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           {CATEGORIES.map((c) => {
//             const Icon = CATEGORY_ICONS[c] ?? Sparkles;
//             return (
//               <Link
//                 key={c}
//                 href={`/services?category=${encodeURIComponent(c)}`}
//                 className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
//               >
//                 <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
//                   <Icon className="size-5" />
//                 </span>
//                 <span className="font-medium">{c}</span>
//               </Link>
//             );
//           })}
//         </div>
//       </section>

//       <section className="mx-auto max-w-6xl px-4 py-14">
//         <h2 className="text-center text-2xl font-bold">How it works</h2>
//         <p className="mt-1 text-center text-muted-foreground">
//           Three simple steps from browsing to a fresh new look.
//         </p>
//         <div className="mt-8 grid gap-6 md:grid-cols-3">
//           {STEPS.map((s, i) => (
//             <div
//               key={s.title}
//               className="relative rounded-2xl border bg-card p-6 text-center"
//             >
//               <span className="absolute -top-3 left-1/2 flex size-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
//                 {i + 1}
//               </span>
//               <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-primary">
//                 <s.icon className="size-5" />
//               </span>
//               <h3 className="mt-4 font-semibold">{s.title}</h3>
//               <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="mx-auto max-w-6xl px-4 pb-14">
//         <h2 className="text-2xl font-bold">Why Choose SalonBook</h2>
//         <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           {WHY_US.map((item) => (
//             <div key={item.title} className="rounded-2xl border bg-card p-5">
//               <h3 className="font-semibold">{item.title}</h3>
//               <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
//             </div>
//           ))}
//         </div>
//       </section>
//       <Faq />
//     </>
//   );
// }


import Link from "next/link";
import {
  Brush,
  Flower2,
  Hand,
  Leaf,
  Palette,
  Scissors,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { FeaturedServices } from "@/components/services/featured-services";
import { HowItWorks } from "@/components/home/how-it-works";
import { Faq } from "@/components/home/faq";
import { CATEGORIES } from "@/constants/categories";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Haircut & Styling": Scissors,
  "Hair Coloring": Palette,
  "Hair Treatment": Sparkles,
  "Facial & Skincare": Flower2,
  Makeup: Brush,
  "Manicure & Pedicure": Hand,
  "Spa & Massage": Leaf,
};

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
            className="mt-8 inline-flex h-11 items-center rounded-lg bg-primary px-6 font-medium text-primary-foreground hover:opacity-90"
          >
            Explore Salon Services
          </Link>
        </div>
      </section>

      <FeaturedServices />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-bold">Service Categories</h2>
        <p className="mt-1 text-muted-foreground">
          Find the right treatment for you.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c] ?? Sparkles;
            return (
              <Link
                key={c}
                href={`/services?category=${encodeURIComponent(c)}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="font-medium">{c}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <HowItWorks />

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl font-bold">Why Choose SalonBook</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_US.map((item) => (
            <div key={item.title} className="rounded-2xl border bg-card p-5">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Faq />
    </>
  );
}
