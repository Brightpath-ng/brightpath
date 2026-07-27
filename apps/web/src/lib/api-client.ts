import { auth } from "@clerk/nextjs/server";
import type { ZodType } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Server-only -- attaches the caller's Clerk session token so apps/api's
// requireAuth/requireRole middleware can verify it. Every future
// authenticated apps/web -> apps/api call should go through this rather
// than a one-off fetch, so the token-attaching and error-shaping happens in
// exactly one place.
export async function apiFetch<T>(
  path: string,
  schema: ZodType<T>,
  init?: RequestInit
): Promise<T> {
  const { getToken } = await auth();
  const token = await getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `${path} responded with ${response.status}`);
  }

  const data: unknown = await response.json();
  return schema.parse(data);
}
