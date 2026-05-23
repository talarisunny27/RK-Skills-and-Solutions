"use client";  
import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
  clerkConfig?: {
    publishableKey?: string;
    signInUrl?: string;
    signUpUrl?: string;
  };
};

export function Providers({ children, clerkConfig }: ProvidersProps) {
  return (
    <ClerkProvider
      publishableKey={clerkConfig?.publishableKey}
      signInUrl={clerkConfig?.signInUrl}
      signUpUrl={clerkConfig?.signUpUrl}
    >
      {children}
    </ClerkProvider>
  );
}
