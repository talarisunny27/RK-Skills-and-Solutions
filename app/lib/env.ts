import "server-only";

function readEnv(name: string): string | undefined {
    const value = process.env[name]?.trim();
    return value ? value : undefined;
}

export function getApiBaseUrl(): string {
    return readEnv("NEXT_PUBLIC_API_BASE_URL") || "http://13.211.147.134:8080";
}

export function getClerkPublicConfig() {
    return {
        publishableKey: readEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
        signInUrl: readEnv("NEXT_PUBLIC_CLERK_SIGN_IN_URL"),
        signUpUrl: readEnv("NEXT_PUBLIC_CLERK_SIGN_UP_URL"),
    };
}
