import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const maxDuration = 30;

export const { GET, POST } = toNextJsHandler(auth);