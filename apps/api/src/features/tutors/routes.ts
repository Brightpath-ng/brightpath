import { Router } from "express";
import { handleApplyAsTutor } from "./controller.js";

export const tutorsRouter: Router = Router();

// Public -- the applicant doesn't have an account yet (apps/api creates it
// server-side, see service.ts).
tutorsRouter.post("/tutors/apply", handleApplyAsTutor);
