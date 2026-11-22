"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export type StatusDatum = { name: string; value: number; color: string };
export type ServiceDatum = { name: string; bookings: number };

const tooltipStyle = {
    backgroundColor: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--popover-foreground)",
    fontSize: 12,
};

const short = (s: string) => (s.length > 16 ? `${s.slice(0, 15)}…` : s);

export function AdminCharts({
    status,
    services,
}: {
    status: StatusDatum[];
    services: ServiceDatum[];
}) {
    const totalRequests = status.reduce((sum, s) => sum + s.value, 0);

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border bg-card p-5">
                <h2 className="font-semibold">Appointments by status</h2>
                {totalRequests === 0 ? (
                    <p className="mt-10 pb-10 text-center text-sm text-muted-foreground">
                        No appointment data yet.
                    </p>
                ) : (
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={status}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={55}
                                    outerRadius={90}
                                    paddingAngle={3}
                                >
                                    {status.map((s) => (
                                        <Cell key={s.name} fill={s.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            <div className="rounded-2xl border bg-card p-5">
                <h2 className="font-semibold">Most requested services</h2>
                {services.length === 0 ? (
                    <p className="mt-10 pb-10 text-center text-sm text-muted-foreground">
                        No appointment data yet.
                    </p>
                ) : (
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={services} layout="vertical" margin={{ left: 8 }}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={false}
                                    stroke="var(--border)"
                                />
                                <XAxis
                                    type="number"
                                    allowDecimals={false}
                                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={110}
                                    tickFormatter={short}
                                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    cursor={{ fill: "var(--accent)" }}
                                />
                                <Bar
                                    dataKey="bookings"
                                    name="Requests"
                                    fill="var(--primary)"
                                    radius={[0, 6, 6, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}