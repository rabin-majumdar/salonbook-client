# SalonBook Client

Next.js frontend for **SalonBook**, a role-based salon appointment booking platform. Customers explore salon services, request appointments and pay for confirmed ones online. Admins manage services, appointments, customers and payments from a dedicated dashboard.

## Live Links

- Live Website: https://salonbook-client-bice.vercel.app
- Client Repository: https://github.com/rabin-majumdar/salonbook-client
- Server Repository: https://github.com/rabin-majumdar/salonbook-server

## Important Features

- Public home page with a banner, featured services and service categories
- Browse services with search by name, category filter and price sorting
- Protected service details page with an appointment booking form and live time-slot availability
- Email/password and Google authentication with Better Auth, with role-based redirects after sign in
- Signed-in users are redirected away from the sign in and sign up pages
- Customer dashboard: overview statistics, my appointments (details, cancel pending requests, pay for confirmed ones), payment history, profile
- Admin dashboard: overview statistics, manage services (add, update, delete, activate or deactivate, image upload), manage appointments (confirm or cancel), manage users (block or unblock), transactions, profile
- Profile management with image upload (stored on ImgBB) and phone number
- Stripe Checkout payment with success and cancel pages
- Role-protected dashboard routes; blocked users cannot use protected features
- Responsive layout, loading skeletons, toast notifications, confirmation dialogs and a custom 404 page

## Technology Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Better Auth (email/password and Google), MongoDB, Sonner, Lucide icons

## Installation

```bash
git clone https://github.com/rabin-majumdar/salonbook-client.git
cd salonbook-client
npm install
```

## Required Environment Variables

Create a `.env.local` file in the project root (never commit it). Names only:

```
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
NEXT_PUBLIC_API_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## How to Run Locally

1. Start the server repository first (it runs on port 5000 by default).
2. In this project run:

```bash
npm run dev
```

3. Open `http://localhost:3000`.

For Google sign in, add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI in your Google Cloud OAuth client.

## Roles

Admin accounts cannot be created through public registration. New accounts are always created as customers, and an admin is assigned securely from the server repository.