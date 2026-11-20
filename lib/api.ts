import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T = unknown>(
    path: string,
    options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
    const { auth = false, headers, body, ...rest } = options;
    const finalHeaders = new Headers(headers);

    if (auth) {
        const { data } = await authClient.token();
        if (!data?.token) throw new Error("Please sign in again");
        finalHeaders.set("Authorization", `Bearer ${data.token}`);
    }
    if (body && !(body instanceof FormData)) {
        finalHeaders.set("Content-Type", "application/json");
    }

    const res = await fetch(`${API_URL}${path}`, {
        ...rest,
        body,
        headers: finalHeaders,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || "Something went wrong");
    return json as T;
}