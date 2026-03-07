"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(formData: {
    college: string;
    age: number;
    gender: string;
}) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const client = await clerkClient();

    try {
        await client.users.updateUser(userId, {
            publicMetadata: {
                onboardingCompleted: true,
                college: formData.college,
                age: formData.age,
                gender: formData.gender,
            },
        });

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error updating user metadata:", error);
        return { success: false, error: "Failed to update user details" };
    }
}
