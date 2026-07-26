import { describe, expect, it } from "vitest";
import { decideRouting } from "../auth-routing.js";

describe("decideRouting", () => {
  it("allows public routes regardless of auth state", () => {
    expect(
      decideRouting({ pathname: "/sign-in", isPublicRoute: true, isSignedIn: false, role: null })
    ).toEqual({ action: "allow" });
  });

  it("sends signed-out users to sign-in for any non-public route", () => {
    expect(
      decideRouting({ pathname: "/parent", isPublicRoute: false, isSignedIn: false, role: null })
    ).toEqual({ action: "redirect", to: "/sign-in" });
  });

  it("sends a signed-in user with no role yet to /pending", () => {
    expect(
      decideRouting({ pathname: "/parent", isPublicRoute: false, isSignedIn: true, role: null })
    ).toEqual({ action: "redirect", to: "/pending" });
  });

  it("lets a roleless signed-in user stay on /pending without looping", () => {
    expect(
      decideRouting({ pathname: "/pending", isPublicRoute: false, isSignedIn: true, role: null })
    ).toEqual({ action: "allow" });
  });

  it("allows a user onto their own role's routes", () => {
    expect(
      decideRouting({ pathname: "/parent", isPublicRoute: false, isSignedIn: true, role: "parent" })
    ).toEqual({ action: "allow" });
    expect(
      decideRouting({
        pathname: "/parent/lessons",
        isPublicRoute: false,
        isSignedIn: true,
        role: "parent",
      })
    ).toEqual({ action: "allow" });
  });

  it("redirects a user away from another role's routes to their own", () => {
    expect(
      decideRouting({ pathname: "/admin", isPublicRoute: false, isSignedIn: true, role: "parent" })
    ).toEqual({ action: "redirect", to: "/parent" });
  });

  it("redirects a signed-in, roled user away from the root path to their dashboard", () => {
    expect(
      decideRouting({ pathname: "/", isPublicRoute: false, isSignedIn: true, role: "tutor" })
    ).toEqual({ action: "redirect", to: "/tutor" });
  });
});
