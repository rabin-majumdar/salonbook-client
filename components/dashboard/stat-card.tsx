export function StatCard({
    label,
    value,
}: {
    label: string;
    value?: number;
}) {
    return (
        <div className="rounded-2xl border p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            {value === undefined ? (
                <div className="mt-3 h-8 w-16 animate-pulse rounded bg-muted" />
            ) : (
                <p className="mt-2 text-3xl font-bold">{value}</p>
            )}
        </div>
    );
}