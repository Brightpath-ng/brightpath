import { describe, expect, it } from "vitest";
import type { NextRequest } from "next/server";
import { redirectFromRoot, type RootRedirectAuth } from "../middleware.js";

function buildReq(): NextRequest {
  return { url: "http://localhost:3001/" } as NextRequest;
}

describe("redirectFromRoot", () => {
  it("redirects to /sign-in when there is no signed-in user", async () => {
    const auth: RootRedirectAuth = () =>
      Promise.resolve({ userId: null, sessionClaims: undefined });

    const response = await redirectFromRoot(auth, buildReq());

    expect(response.headers.get("location")).toBe("http://localhost:3001/sign-in");
  });

  it("redirects to /pending when signed in but no role is set yet", async () => {
    const auth: RootRedirectAuth = () =>
      Promise.resolve({ userId: "user_1", sessionClaims: { publicMetadata: {} } });

    const response = await redirectFromRoot(auth, buildReq());

    expect(response.headers.get("location")).toBe("http://localhost:3001/pending");
  });

  it("redirects to the user's own role route when a role is set", async () => {
    const auth: RootRedirectAuth = () =>
      Promise.resolve({
        userId: "user_1",
        sessionClaims: { publicMetadata: { role: "admin" } },
      });

    const response = await redirectFromRoot(auth, buildReq());

    expect(response.headers.get("location")).toBe("http://localhost:3001/admin");
  });
});
