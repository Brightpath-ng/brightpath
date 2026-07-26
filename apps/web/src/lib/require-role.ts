import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { RoleName } from "@brightpath/types";

// Resource-based auth check, called from each role-group's layout.tsx --
// Clerk's now-recommended replacement for centralized middleware path
// matching (createRouteMatcher is deprecated: middleware-based matching can
// diverge from how Next.js actually resolves a route -- dynamic segments,
// rewrites, parallel routes -- leaving a protected page reachable). Running
// the check directly in the layout Next.js has already resolved to closes
// that gap.
export async function requireRole(role: RoleName): Promise<void> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const actualRole = sessionClaims?.publicMetadata?.role;

  // The user.created webhook that assigns a role is async with only
  // at-least-once delivery, so a freshly signed-up user legitimately has no
  // role for a short window -- not an error case.
  if (!actualRole) {
    redirect("/pending");
  }

  if (actualRole !== role) {
    redirect(`/${actualRole}`);
  }
}
