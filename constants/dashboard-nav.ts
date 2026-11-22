export type NavItem = { label: string; href: string };

export const CUSTOMER_NAV: NavItem[] = [
    { label: "Overview", href: "/dashboard/customer" },
    { label: "My Appointments", href: "/dashboard/customer/appointments" },
    { label: "Payment History", href: "/dashboard/customer/payments" },
    { label: "My Profile", href: "/dashboard/customer/profile" },
];

export const ADMIN_NAV: NavItem[] = [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Manage Services", href: "/dashboard/admin/services" },
    { label: "Add Service", href: "/dashboard/admin/services/new" },
    { label: "Manage Appointments", href: "/dashboard/admin/appointments" },
    { label: "Manage Users", href: "/dashboard/admin/users" },
    { label: "Transactions", href: "/dashboard/admin/transactions" },
    { label: "My Profile", href: "/dashboard/admin/profile" },
];