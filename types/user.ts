export type User = {
    _id: string;
    name: string;
    email: string;
    image?: string;
    phone?: string;
    role: string;
    isBlocked?: boolean;
    createdAt: string;
};