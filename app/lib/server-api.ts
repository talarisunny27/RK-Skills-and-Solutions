export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export function backendUrl(path: string): string {
    return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getBackendErrorMessage(error: unknown, fallback: string): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "cause" in error &&
        typeof (error as { cause?: { code?: string } }).cause?.code === "string" &&
        (error as { cause?: { code?: string } }).cause?.code === "ECONNREFUSED"
    ) {
        return `Backend unavailable at ${API_BASE_URL}`;
    }

    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: string }).message === "string"
    ) {
        return (error as { message: string }).message;
    }

    return fallback;
}
