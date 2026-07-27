import type { Request, Response } from "express";
import { createClerkClient } from "@clerk/backend";
import { TutorApplicationInputSchema } from "@brightpath/types";
import { createTutorsService, DuplicateApplicationError } from "./service.js";
import { findClerkUserByEmail, createClerkUser } from "../../lib/clerk.js";
import * as repository from "./repository.js";

function getTutorsService() {
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

  return createTutorsService({
    findUserByEmail: repository.findUserByEmail,
    findClerkUserByEmail: (email) => findClerkUserByEmail(clerk, email),
    createClerkUser: (input) => createClerkUser(clerk, input),
    setClerkPublicMetadataRole: async (clerkId, role) => {
      await clerk.users.updateUserMetadata(clerkId, { publicMetadata: { role } });
    },
    findDefaultTenant: repository.findDefaultTenant,
    findRoleByName: repository.findRoleByName,
    createUserWithTutorProfile: repository.createUserWithTutorProfile,
  });
}

export async function handleApplyAsTutor(req: Request, res: Response) {
  const parsed = TutorApplicationInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid application", details: parsed.error.flatten() });
    return;
  }

  try {
    const { user, tutorProfile } = await getTutorsService().applyAsTutor(parsed.data);
    res.status(201).json({ userId: user.id, tutorProfileId: tutorProfile.id });
  } catch (error) {
    if (error instanceof DuplicateApplicationError) {
      res.status(409).json({ error: error.message });
      return;
    }
    console.error("Failed to process tutor application", error);
    res.status(500).json({ error: "Internal error" });
  }
}
