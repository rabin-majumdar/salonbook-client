export type Appointment = {
    _id: string;
    serviceId: {
        _id: string;
        serviceName: string;
        category: string;
        image: string;
        price: number;
        duration: number;
    } | null;
    customerId: string;
    appointmentDate: string;
    timeSlot: string;
    message?: string;
    servicePrice: number;
    paymentStatus: "unpaid" | "paid";
    status: "pending" | "confirmed" | "cancelled";
    createdAt: string;
};

export type AdminAppointment = Appointment & {
    customer: { name: string; email: string; image?: string } | null;
};