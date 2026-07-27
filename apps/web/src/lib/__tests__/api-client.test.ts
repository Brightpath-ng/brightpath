import { describe, expect, it, vi, beforeEach } from "vitest";
import { z } from "zod";

const getToken = vi.fn();
vi.mock("@clerk/nextjs/server", () => ({
  auth: () => Promise.resolve({ getToken }),
}));

const { apiFetch, ApiError } = await import("../api-client.js");

const schema = z.object({ id: z.string() });

describe("apiFetch", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    getToken.mockReset();
    getToken.mockResolvedValue("fake-session-token");
  });

  it("attaches the bearer token and parses the response against the schema", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ id: "tutor_profile_1" }), { status: 200 })
    );

    const result = await apiFetch("/tutors/me", schema);

    expect(result).toEqual({ id: "tutor_profile_1" });
    const [url, init] = vi.mocked(fetch).mock.calls[0]!;
    expect(url).toBe("http://localhost:4000/tutors/me");
    expect((init?.headers as Record<string, string>).Authorization).toBe(
      "Bearer fake-session-token"
    );
  });

  it("omits the Authorization header when there is no token", async () => {
    getToken.mockResolvedValue(null);
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ id: "x" }), { status: 200 }));

    await apiFetch("/tutors/me", schema);

    const [, init] = vi.mocked(fetch).mock.calls[0]!;
    expect((init?.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it("throws ApiError with the response status on a non-2xx response", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 404 }));

    await expect(apiFetch("/tutors/me", schema)).rejects.toThrow(ApiError);
    await expect(apiFetch("/tutors/me", schema)).rejects.toMatchObject({ status: 404 });
  });

  it("throws when the response body doesn't match the schema", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ wrong: "shape" }), { status: 200 })
    );

    await expect(apiFetch("/tutors/me", schema)).rejects.toThrow();
  });
});
