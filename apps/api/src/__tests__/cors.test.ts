import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("CORS", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("allows a configured origin", async () => {
    vi.stubEnv("MARKETING_ORIGIN", "https://brightpath.example");
    vi.stubEnv("WEB_ORIGIN", "https://app.brightpath.example");
    const { createApp } = await import("../app.js");

    const response = await request(createApp())
      .get("/health")
      .set("Origin", "https://brightpath.example");

    expect(response.headers["access-control-allow-origin"]).toBe("https://brightpath.example");

    vi.unstubAllEnvs();
  });

  it("does not allow an unlisted origin", async () => {
    vi.stubEnv("MARKETING_ORIGIN", "https://brightpath.example");
    vi.stubEnv("WEB_ORIGIN", "https://app.brightpath.example");
    const { createApp } = await import("../app.js");

    const response = await request(createApp())
      .get("/health")
      .set("Origin", "https://evil.example");

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();

    vi.unstubAllEnvs();
  });
});
