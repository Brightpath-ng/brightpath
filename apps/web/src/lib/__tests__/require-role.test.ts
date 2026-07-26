import { describe, expect, it, vi, beforeEach } from "vitest";

// next/navigation's real redirect() throws a special error to unwind
// rendering -- mocking it to throw here matches that behavior, rather than
// letting execution fall through past a redirect the way a no-op mock would.
vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

const authMock = vi.fn();
vi.mock("@clerk/nextjs/server", () => ({
  auth: () => authMock(),
}));

const { requireRole } = await import("../require-role.js");

describe("requireRole", () => {
  beforeEach(() => {
    authMock.mockReset();
  });

  it("redirects to /sign-in when there is no signed-in user", async () => {
    authMock.mockResolvedValue({ userId: null, sessionClaims: undefined });

    await expect(requireRole("parent")).rejects.toThrow("REDIRECT:/sign-in");
  });

  it("redirects to /pending when signed in but no role is set yet", async () => {
    authMock.mockResolvedValue({
      userId: "user_1",
      sessionClaims: { publicMetadata: {} },
    });

    await expect(requireRole("parent")).rejects.toThrow("REDIRECT:/pending");
  });

  it("redirects to the user's own role route when it doesn't match the required role", async () => {
    authMock.mockResolvedValue({
      userId: "user_1",
      sessionClaims: { publicMetadata: { role: "tutor" } },
    });

    await expect(requireRole("admin")).rejects.toThrow("REDIRECT:/tutor");
  });

  it("does not redirect when the signed-in user's role matches", async () => {
    authMock.mockResolvedValue({
      userId: "user_1",
      sessionClaims: { publicMetadata: { role: "parent" } },
    });

    await expect(requireRole("parent")).resolves.toBeUndefined();
  });
});
