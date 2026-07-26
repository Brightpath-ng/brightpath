import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

const authMock = vi.fn();
vi.mock("@clerk/nextjs/server", () => ({
  auth: () => authMock(),
}));

const { default: Home } = await import("../page.js");

describe("Home (root page)", () => {
  beforeEach(() => {
    authMock.mockReset();
  });

  it("redirects signed-out visitors to /sign-in", async () => {
    authMock.mockResolvedValue({ userId: null, sessionClaims: undefined });
    await expect(Home()).rejects.toThrow("REDIRECT:/sign-in");
  });

  it("redirects a roleless signed-in user to /pending", async () => {
    authMock.mockResolvedValue({
      userId: "user_1",
      sessionClaims: { publicMetadata: {} },
    });
    await expect(Home()).rejects.toThrow("REDIRECT:/pending");
  });

  it("redirects a signed-in user with a role to their own dashboard", async () => {
    authMock.mockResolvedValue({
      userId: "user_1",
      sessionClaims: { publicMetadata: { role: "admin" } },
    });
    await expect(Home()).rejects.toThrow("REDIRECT:/admin");
  });
});
