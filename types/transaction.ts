export type Transaction = {
    _id: string;
    amount: number;
    currency: string;
    stripeSessionId: string;
    status: "paid" | "failed";
    createdAt: string;
    appointmentId: {
        appointmentDate: string;
        timeSlot: string;
        serviceId: { serviceName: string } | null;
    } | null;
    customer: { name: string; email: string } | null;
};