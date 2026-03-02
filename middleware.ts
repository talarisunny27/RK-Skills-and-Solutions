import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/enquiry',   // Public – anyone can submit the landing page enquiry form
]);

const isAdminRoute = createRouteMatcher([
    '/admin(.*)',
]);

const isStudentRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/assessments(.*)',
    '/results(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    // 1. If not a public route, protect it
    if (!isPublicRoute(req)) {
        await auth.protect();
    }

    const { userId, sessionClaims } = await auth();

    // Try to find role in common locations
    const role = (sessionClaims?.metadata as any)?.role || (sessionClaims as any)?.publicMetadata?.role;

    // 2. If logged in...
    if (userId) {
        // Redirect Admin at student routes to /admin
        if (role === "admin" && isStudentRoute(req)) {
            return NextResponse.redirect(new URL('/admin', req.url));
        }

        // Handle landing page redirect for logged-in users
        if (req.nextUrl.pathname === '/') {
            const redirectUrl = (role === "admin") ? '/admin' : '/dashboard';
            return NextResponse.redirect(new URL(redirectUrl, req.url));
        }
    }
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};