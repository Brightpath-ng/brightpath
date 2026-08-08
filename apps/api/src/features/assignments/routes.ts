import { Router } from "express";
import { requireRole } from "../../middleware/require-auth.js";
import {
  handleAssignTutor,
  handleListAssignments,
  handleGetAssignment,
  handleEndAssignment,
} from "./controller.js";

export const assignmentsRouter: Router = Router();

assignmentsRouter.post("/assignments", requireRole("admin"), handleAssignTutor);
assignmentsRouter.get("/assignments", requireRole("admin"), handleListAssignments);
assignmentsRouter.get("/assignments/:id", requireRole("admin"), handleGetAssignment);
assignmentsRouter.post("/assignments/:id/end", requireRole("admin"), handleEndAssignment);
