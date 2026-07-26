import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// No .js extension here, unlike every other relative import in this codebase --
// Turbopack's Edge Runtime bundler (used only for middleware) doesn't resolve a
// ".js"-suffixed import to a ".ts" file the way its Node.js-targeted bundler
// does elsewhere in the app. With the extension, this 404s at runtime with no
// typecheck/lint error, since TS resolution and the Edge bundler's resolution
// disagree. Found by actually running the dev server, not from reading the code.
import { decideRouting } from "./lib/auth-routing";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  const decision = decideRouting({
    pathname: req.nextUrl.pathname,
    isPublicRoute: isPublicRoute(req),
    isSignedIn: Boolean(userId),
    role: sessionClaims?.publicMetadata?.role ?? null,
  });

  if (decision.action === "allow") {
    return;
  }

  if (decision.to === "/sign-in") {
    return redirectToSignIn();
  }

  return NextResponse.redirect(new URL(decision.to, req.url));
});

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico)).*)",
    "/(api|trpc)(.*)",
  ],
};
