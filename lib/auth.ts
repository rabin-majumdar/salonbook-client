
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

const client =
    globalForMongo._mongoClient ??
    new MongoClient(uri, { serverSelectionTimeoutMS: 20000 });
globalForMongo._mongoClient = client;

const db = client.db("salonBook-db");

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
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