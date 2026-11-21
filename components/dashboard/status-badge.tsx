const STYLES: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
    paid: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
    unpaid: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    active: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export function StatusBadge({ value }: { value: string }) {
    return (
        <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STYLES[value] || STYLES.unpaid
                }`}
        >
            {value}
        </span>
    );
}