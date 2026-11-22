import {
    CalendarDays,
    CircleDollarSign,
    CirclePlus,
    LayoutDashboard,
    Receipt,
    Scissors,
    User,
    Users,
    type LucideIcon,
} from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon };

export const CUSTOMER_NAV: NavItem[] = [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    {
        label: "My Appointments",
        href: "/dashboard/customer/appointments",
        icon: CalendarDays,
    },
    {
        label: "Payment History",
        href: "/dashboard/customer/payments",
        icon: CircleDollarSign,
    },
    { label: "My Profile", href: "/dashboard/customer/profile", icon: User },
];

export const ADMIN_NAV: NavItem[] = [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Services", href: "/dashboard/admin/services", icon: Scissors },
    { label: "Add Service", href: "/dashboard/admin/services/new", icon: CirclePlus },
    {
        label: "Manage Appointments",
        href: "/dashboard/admin/appointments",
        icon: CalendarDays,
    },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
    { label: "My Profile", href: "/dashboard/admin/profile", icon: User },
];