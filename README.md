# SalonBook Client

Next.js frontend for **SalonBook**, a salon appointment booking platform with a customer dashboard and an admin dashboard.

## Live Links

- Live Website: https://salonbook-client-bice.vercel.app
- Client Repository: https://github.com/rabin-majumdar/salonbook-client
- Server Repository: https://github.com/rabin-majumdar/salonbook-server

## Important Features

- Public home page with featured services and service categories
- Browse services with search by name, category filter and price sorting
- Protected service details page with an appointment booking form and live slot availability
- Email and password authentication with Better Auth, role-based redirects
- Customer dashboard: overview, my appointments (details, cancel pending, pay confirmed), profile
- Admin dashboard: overview, manage services (add, update, delete, activate/deactivate with image upload), manage appointments, manage users (block/unblock), transactions
- Stripe Checkout payment with success and cancel pages
- Responsive layout, loading skeletons, toast notifications and confirmation dialogs

## Technology Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Better Auth, MongoDB, Sonner

## Installation

```bash
git clone https://github.com/rabin-majumdar/salonbook-client.git
cd salonbook-client
npm install
```

## Required Environment Variables

Create `.env.local` in the project root (never commit it). Names only:

```
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
NEXT_PUBLIC_API_URL=
```

## How to Run Locally

Start the server repository first (it runs on port 5000), then:

```bash
npm run dev
```

Open `http://localhost:3000`.
