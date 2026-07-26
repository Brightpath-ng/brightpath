import { render, screen } from "@testing-library/react";
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

const { default: PendingPage } = await import("../page.js");

describe("PendingPage", () => {
  beforeEach(() => {
    authMock.mockReset();
  });

  it("redirects to /sign-in when signed out", async () => {
    authMock.mockResolvedValue({ userId: null, sessionClaims: undefined });
    await expect(PendingPage()).rejects.toThrow("REDIRECT:/sign-in");
  });

  it("redirects to the user's dashboard once a role is set", async () => {
    authMock.mockResolvedValue({
      userId: "user_1",
      sessionClaims: { publicMetadata: { role: "tutor" } },
    });
    await expect(PendingPage()).rejects.toThrow("REDIRECT:/tutor");
  });

  it("explains the wait and offers a way to refresh when signed in with no role yet", async () => {
    authMock.mockResolvedValue({
      userId: "user_1",
      sessionClaims: { publicMetadata: {} },
    });

    render(await PendingPage());

    expect(screen.getByRole("heading", { name: /setting up your account/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Refresh" })).toHaveAttribute("href", "/");
  });
});
