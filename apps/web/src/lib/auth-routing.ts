import type { RoleName } from "@brightpath/types";

export type RoutingDecision = { action: "allow" } | { action: "redirect"; to: string };

export interface RoutingInput {
  pathname: string;
  isPublicRoute: boolean;
  isSignedIn: boolean;
  role: RoleName | null;
}

// Pure decision function -- no Next.js/Clerk request or response objects --
// so the role-gating rules are unit-testable without mocking either. This is
// called from middleware.ts, which handles turning a decision into an actual
// redirect using auth().redirectToSignIn() / NextResponse.redirect().
export function decideRouting(input: RoutingInput): RoutingDecision {
  if (input.isPublicRoute) {
    return { action: "allow" };
  }

  if (!input.isSignedIn) {
    return { action: "redirect", to: "/sign-in" };
  }

  if (!input.role) {
    // The user.created webhook that assigns a role is async and Clerk only
    // guarantees at-least-once delivery, so a freshly signed-up user
    // legitimately has no role for a short window -- not an error case.
    return input.pathname === "/pending"
      ? { action: "allow" }
      : { action: "redirect", to: "/pending" };
  }

  const rolePrefix = `/${input.role}`;
  const isOwnRoute = input.pathname === rolePrefix || input.pathname.startsWith(`${rolePrefix}/`);

  return isOwnRoute ? { action: "allow" } : { action: "redirect", to: rolePrefix };
}
