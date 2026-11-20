import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

const client = new MongoClient(uri);
const db = client.db('salonBook-db');

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    user: {
        modelName: "users",
        additionalFields: {
            role: { type: "string", defaultValue: "customer", input: false },
            isBlocked: { type: "boolean", defaultValue: false, input: false },
            phone: { type: "string", required: false },
        },
    },
    plugins: [jwt()],
});