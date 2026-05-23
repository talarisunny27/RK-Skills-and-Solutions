import { auth } from "@clerk/nextjs/server";

const DEFAULT_API_BASE_URL = "http://13.211.147.134:8080";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

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

    const normalizedBaseUrl = API_BASE_URL.endsWith("/")
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;

    const url = endpoint.startsWith("http")
        ? endpoint
        : `${normalizedBaseUrl}${endpoint}`;

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
