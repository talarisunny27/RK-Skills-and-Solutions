"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SyncUser() {
    const { isLoaded, isSignedIn, user } = useUser();

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            const syncUser = async () => {
                try {
                    // Try to get college from publicMetadata or default to TKR College
                    const college = (user.publicMetadata?.college as string) || "TKR College";

                    await fetch("/api/auth/sync", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: user.primaryEmailAddress?.emailAddress,
                            name: user.fullName || user.username || "User",
                            college: college,
                        }),
                    });
                } catch (error) {
                    console.error("Failed to sync user:", error);
                }
            };

            syncUser();
        }
    }, [isLoaded, isSignedIn, user]);

    return null;
}
