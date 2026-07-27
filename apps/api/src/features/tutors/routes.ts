import { Router } from "express";
import { requireRole } from "../../middleware/require-auth.js";
import {
  handleApplyAsTutor,
  handleGetMyProfile,
  handleListApplications,
  handleApproveApplication,
  handleRejectApplication,
} from "./controller.js";

export const tutorsRouter: Router = Router();

// Public -- the applicant doesn't have an account yet (apps/api creates it
// server-side, see service.ts).
tutorsRouter.post("/tutors/apply", handleApplyAsTutor);

tutorsRouter.get("/tutors/me", requireRole("tutor"), handleGetMyProfile);

tutorsRouter.get("/tutors/applications", requireRole("admin"), handleListApplications);
tutorsRouter.post(
  "/tutors/applications/:id/approve",
  requireRole("admin"),
  handleApproveApplication
);
tutorsRouter.post(
  "/tutors/applications/:id/reject",
  requireRole("admin"),
  handleRejectApplication
);
