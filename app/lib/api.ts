import { auth } from "@clerk/nextjs/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/**
 * Server-side helper to call the Spring Boot API
 * Automatically adds the Clerk authentication token
 */
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const { getToken } = await auth();
    const token = await getToken();

    const headers = new Headers(options.headers);
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");

    const url = endpoint.startsWith("http")
        ? endpoint
        : `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
}
