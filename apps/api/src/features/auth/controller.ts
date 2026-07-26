import type { Request, Response } from "express";
import { Webhook } from "svix";
import { createClerkClient } from "@clerk/backend";
import { ClerkUserCreatedEventSchema } from "./schema.js";
import { createAuthService, MissingPrimaryEmailError } from "./service.js";
import * as repository from "./repository.js";

function getAuthService() {
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

  return createAuthService({
    findDefaultTenant: repository.findDefaultTenant,
    findRoleByName: repository.findRoleByName,
    upsertUserByClerkId: repository.upsertUserByClerkId,
    setClerkPublicMetadataRole: async (clerkId, role) => {
      await clerk.users.updateUserMetadata(clerkId, { publicMetadata: { role } });
    },
  });
}

export async function handleClerkWebhook(req: Request, res: Response) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set -- cannot verify incoming webhooks");
    res.status(500).json({ error: "Webhook not configured" });
    return;
  }

  const svixId = req.header("svix-id");
  const svixTimestamp = req.header("svix-timestamp");
  const svixSignature = req.header("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    res.status(400).json({ error: "Missing svix headers" });
    return;
  }

  let payload: unknown;
  try {
    // express.raw() (mounted on this route only, see routes.ts) gives us the
    // exact bytes Clerk signed -- verification fails against a re-serialized
    // JSON body, which is why this route can't use the global express.json().
    payload = new Webhook(secret).verify(req.body as Buffer, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch {
    res.status(401).json({ error: "Invalid webhook signature" });
    return;
  }

  const parsed = ClerkUserCreatedEventSchema.safeParse(payload);
  if (!parsed.success) {
    // Not a user.created event (or a shape we don't handle yet). Acknowledge
    // with 200 so Clerk doesn't retry an event we're intentionally ignoring.
    res.status(200).json({ received: true, handled: false });
    return;
  }

  try {
    await getAuthService().handleUserCreated(parsed.data);
    res.status(200).json({ received: true, handled: true });
  } catch (error) {
    if (error instanceof MissingPrimaryEmailError) {
      res.status(400).json({ error: error.message });
      return;
    }
    console.error("Failed to handle Clerk user.created webhook", error);
    res.status(500).json({ error: "Internal error" });
  }
}
