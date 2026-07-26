import { clerkMiddleware } from "@clerk/nextjs/server";

// No route matching or redirect logic here on purpose -- Clerk's
// createRouteMatcher-based path matching is deprecated in favor of
// resource-based auth checks (requireRole() called directly from each role
// group's layout.tsx, e.g. apps/web/src/app/(admin)/layout.tsx). Rationale
// from Clerk: middleware-based matching can diverge from how Next.js
// actually resolves a route (dynamic segments, rewrites, parallel routes),
// leaving a protected page reachable. This middleware's only job is to
// establish the auth context that auth() reads in Server Components -- it
// still needs to run on every page for that to work, hence the broad matcher.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico)).*)",
    "/(api|trpc)(.*)",
  ],
};
