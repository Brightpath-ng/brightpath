import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "@clerk/backend";
import { z } from "zod";
import { RoleNameSchema, type RoleName } from "@brightpath/types";

declare global {
  // Augmenting Express's own Request type requires its own `declare global
  // namespace Express` merge -- this is Express's documented pattern for
  // adding request properties, not something an ES module import can do.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: { userId: string; role?: RoleName };
    }
  }
}

// Only the claims this middleware actually reads. publicMetadata.role is only
// present because of the manual Clerk Dashboard "Customize session token"
// step documented in .env.example -- absent entirely for a session token
// issued before that step, hence optional rather than required.
const SessionClaimsSchema = z.object({
  sub: z.string(),
  publicMetadata: z.object({ role: RoleNameSchema.optional() }).optional(),
});

type AuthResult =
  | { ok: true; auth: NonNullable<Request["auth"]> }
  | { ok: false; status: number; error: string };

async function verifyBearerToken(req: Request): Promise<AuthResult> {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    return { ok: false, status: 500, error: "CLERK_SECRET_KEY is not set" };
  }

  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;
  if (!token) {
    return { ok: false, status: 401, error: "Missing bearer token" };
  }

  let payload: unknown;
  try {
    payload = await verifyToken(token, { secretKey });
  } catch {
    return { ok: false, status: 401, error: "Invalid or expired token" };
  }

  const parsed = SessionClaimsSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, status: 401, error: "Invalid session claims" };
  }

  return {
    ok: true,
    auth: { userId: parsed.data.sub, role: parsed.data.publicMetadata?.role },
  };
}

// Verifies the caller is signed in (any role). Use requireRole() instead when
// a route also needs to check *which* role.
export function requireAuth() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await verifyBearerToken(req);
    if (!result.ok) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    req.auth = result.auth;
    next();
  };
}

export function requireRole(role: RoleName) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await verifyBearerToken(req);
    if (!result.ok) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    if (result.auth.role !== role) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    req.auth = result.auth;
    next();
  };
}
