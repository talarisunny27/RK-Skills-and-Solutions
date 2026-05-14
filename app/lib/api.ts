import { auth } from "@clerk/nextjs/server";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export function buildApiUrl(endpoint: string): string {
    if (endpoint.startsWith("http")) {
        return endpoint;
    }

    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${normalizedEndpoint}`;
}

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

    const url = buildApiUrl(endpoint);

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
