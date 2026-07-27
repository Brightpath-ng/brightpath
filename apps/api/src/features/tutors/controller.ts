import type { Request, Response } from "express";
import { createClerkClient } from "@clerk/backend";
import type { TutorProfile } from "@brightpath/db";
import { TutorApplicationInputSchema } from "@brightpath/types";
import {
  createTutorsService,
  DuplicateApplicationError,
  TutorProfileNotFoundError,
  ApplicationAlreadyDecidedError,
} from "./service.js";
import { findClerkUserByEmail, createClerkUser } from "../../lib/clerk.js";
import * as repository from "./repository.js";
import type { TutorApplicationSummaryRecord } from "./repository.js";

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
    findTutorProfileByClerkId: repository.findTutorProfileByClerkId,
    findTutorProfileById: repository.findTutorProfileById,
    listPendingTutorProfiles: repository.listPendingTutorProfiles,
    updateTutorProfileStatus: repository.updateTutorProfileStatus,
  });
}

function toTutorProfileDTO(profile: TutorProfile) {
  return {
    id: profile.id,
    userId: profile.userId,
    subjects: profile.subjects,
    qualifications: profile.qualifications,
    bio: profile.bio,
    status: profile.status,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

function toTutorApplicationSummaryDTO(record: TutorApplicationSummaryRecord) {
  return {
    ...toTutorProfileDTO(record),
    name: record.user.name,
    email: record.user.email,
  };
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

// requireRole("tutor") already guarantees req.auth is set before this runs.
export async function handleGetMyProfile(req: Request, res: Response) {
  try {
    const profile = await getTutorsService().getMyProfile(req.auth!.userId);
    res.status(200).json(toTutorProfileDTO(profile));
  } catch (error) {
    if (error instanceof TutorProfileNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Failed to fetch tutor profile", error);
    res.status(500).json({ error: "Internal error" });
  }
}

export async function handleListApplications(_req: Request, res: Response) {
  try {
    const applications = await getTutorsService().listPendingApplications();
    res.status(200).json(applications.map(toTutorApplicationSummaryDTO));
  } catch (error) {
    console.error("Failed to list tutor applications", error);
    res.status(500).json({ error: "Internal error" });
  }
}

function decisionHandler(decide: (id: string) => Promise<TutorProfile>) {
  return async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing application id" });
      return;
    }
    try {
      const profile = await decide(id);
      res.status(200).json(toTutorProfileDTO(profile));
    } catch (error) {
      if (error instanceof TutorProfileNotFoundError) {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error instanceof ApplicationAlreadyDecidedError) {
        res.status(409).json({ error: error.message });
        return;
      }
      console.error("Failed to decide tutor application", error);
      res.status(500).json({ error: "Internal error" });
    }
  };
}

export const handleApproveApplication = decisionHandler((id) =>
  getTutorsService().approveApplication(id)
);

export const handleRejectApplication = decisionHandler((id) =>
  getTutorsService().rejectApplication(id)
);
