import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const verifyToken = vi.fn();

vi.mock("@clerk/backend", () => ({ verifyToken: (...args: unknown[]) => verifyToken(...args) }));

const { requireAuth, requireRole } = await import("../require-auth.js");

function buildReq(headers: Record<string, string> = {}): Request {
  return {
    header: (name: string) => headers[name.toLowerCase()],
  } as unknown as Request;
}

function buildRes(): Response {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("requireAuth", () => {
  beforeEach(() => {
    vi.stubEnv("CLERK_SECRET_KEY", "sk_test_fake");
    vi.clearAllMocks();
  });

  it("returns 500 when CLERK_SECRET_KEY is not set", async () => {
    vi.stubEnv("CLERK_SECRET_KEY", "");
    const req = buildReq({ authorization: "Bearer token" });
    const res = buildRes();
    const next = vi.fn() as unknown as NextFunction;

    await requireAuth()(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when the Authorization header is missing", async () => {
    const req = buildReq();
    const res = buildRes();
    const next = vi.fn() as unknown as NextFunction;

    await requireAuth()(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when verifyToken throws", async () => {
    verifyToken.mockRejectedValue(new Error("invalid token"));
    const req = buildReq({ authorization: "Bearer bad-token" });
    const res = buildRes();
    const next = vi.fn() as unknown as NextFunction;

    await requireAuth()(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when the decoded payload doesn't match the expected shape", async () => {
    verifyToken.mockResolvedValue({ notSub: "oops" });
    const req = buildReq({ authorization: "Bearer token" });
    const res = buildRes();
    const next = vi.fn() as unknown as NextFunction;

    await requireAuth()(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches req.auth and calls next() on a valid token", async () => {
    verifyToken.mockResolvedValue({ sub: "user_1", publicMetadata: { role: "tutor" } });
    const req = buildReq({ authorization: "Bearer good-token" });
    const res = buildRes();
    const next = vi.fn() as unknown as NextFunction;

    await requireAuth()(req, res, next);

    expect(req.auth).toEqual({ userId: "user_1", role: "tutor" });
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("attaches req.auth with an undefined role when publicMetadata has none yet", async () => {
    verifyToken.mockResolvedValue({ sub: "user_1" });
    const req = buildReq({ authorization: "Bearer good-token" });
    const res = buildRes();
    const next = vi.fn() as unknown as NextFunction;

    await requireAuth()(req, res, next);

    expect(req.auth).toEqual({ userId: "user_1", role: undefined });
    expect(next).toHaveBeenCalledOnce();
  });
});

describe("requireRole", () => {
  beforeEach(() => {
    vi.stubEnv("CLERK_SECRET_KEY", "sk_test_fake");
    vi.clearAllMocks();
  });

  it("returns 401 when there is no valid session (same as requireAuth)", async () => {
    const req = buildReq();
    const res = buildRes();
    const next = vi.fn() as unknown as NextFunction;

    await requireRole("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when the caller's role doesn't match", async () => {
    verifyToken.mockResolvedValue({ sub: "user_1", publicMetadata: { role: "tutor" } });
    const req = buildReq({ authorization: "Bearer token" });
    const res = buildRes();
    const next = vi.fn() as unknown as NextFunction;

    await requireRole("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches req.auth and calls next() when the role matches", async () => {
    verifyToken.mockResolvedValue({ sub: "user_1", publicMetadata: { role: "admin" } });
    const req = buildReq({ authorization: "Bearer token" });
    const res = buildRes();
    const next = vi.fn() as unknown as NextFunction;

    await requireRole("admin")(req, res, next);

    expect(req.auth).toEqual({ userId: "user_1", role: "admin" });
    expect(next).toHaveBeenCalledOnce();
  });
});
