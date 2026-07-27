import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

// Minimal structural shape rather than importing Clerk's internal
// ClerkMiddlewareAuth type (not re-exported from @clerk/nextjs/server) --
// matches the same pattern as require-role.ts's auth() destructuring.
export type RootRedirectAuth = () => Promise<{
  userId: string | null;
  sessionClaims?: { publicMetadata?: { role?: string } };
}>;

// Extracted for unit testing -- see __tests__/middleware.test.ts. "/" is a
// deliberate, narrow exception to "no redirect logic in middleware" (see the
// comment below): it needs a real HTTP redirect rather than the Server
// Component redirect() in app/page.tsx, because Next.js App Router has a
// known bug where a redirect() chained onto a client-side (RSC) navigation --
// which is how Clerk's <SignIn fallbackRedirectUrl="/"> lands here -- can
// fetch and even render the destination's content without updating the
// browser's URL, leaving the user stuck until a manual refresh. Redirecting
// here instead produces a genuine 307 the browser follows natively, same as
// what already happens correctly on that manual refresh.
export async function redirectFromRoot(auth: RootRedirectAuth, req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  const role = sessionClaims?.publicMetadata?.role;
  return NextResponse.redirect(new URL(role ? `/${role}` : "/pending", req.url));
}

// No route matching for role-gated pages here on purpose -- Clerk's
// createRouteMatcher-based path matching is deprecated in favor of
// resource-based auth checks (requireRole() called directly from each role
// group's layout.tsx, e.g. apps/web/src/app/(admin)/layout.tsx). Rationale
// from Clerk: middleware-based matching can diverge from how Next.js
// actually resolves a route (dynamic segments, rewrites, parallel routes),
// leaving a protected page reachable. This middleware's main job is to
// establish the auth context that auth() reads in Server Components -- it
// still needs to run on every page for that to work, hence the broad matcher.
// "/" is the one exception (see redirectFromRoot above) -- it has no dynamic
// segments, so none of the risk above applies. app/page.tsx's own redirect()
// still runs as a fallback if "/" is ever reached some other way.
export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname === "/") {
    // auth's real type (Clerk's overloaded AuthFn) has no signature that
    // resolves to a plain zero-arg call in TS's eyes here, even though
    // calling it with no arguments is exactly what require-role.ts already
    // does successfully against the same underlying type -- narrowing to the
    // minimal shape this code actually uses.
    return redirectFromRoot(auth as RootRedirectAuth, req);
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico)).*)",
    "/(api|trpc)(.*)",
  ],
};
