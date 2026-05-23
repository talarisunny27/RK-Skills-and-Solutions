const DEFAULT_API_BASE_URL = "http://13.211.147.134:8080";

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

export function backendUrl(path: string): string {
    const normalizedBaseUrl = API_BASE_URL.endsWith("/")
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;

    return `${normalizedBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function readResponsePreview(response: Response): Promise<string> {
    const body = await response.text().catch(() => "");
    return body.length > 1200 ? `${body.slice(0, 1200)}...` : body;
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

export function getBackendErrorDetails(error: unknown) {
    if (
        typeof error === "object" &&
        error !== null &&
        "cause" in error &&
        typeof (error as { cause?: { code?: string; message?: string } }).cause === "object"
    ) {
        return {
            code: (error as { cause?: { code?: string } }).cause?.code,
            message: (error as { cause?: { message?: string } }).cause?.message,
        };
    }

    return undefined;
}
