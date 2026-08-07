import { Router } from "express";
import { requireRole } from "../../middleware/require-auth.js";
import { handleAddStudent, handleListMyStudents } from "./controller.js";

export const studentsRouter: Router = Router();

studentsRouter.post("/students", requireRole("parent"), handleAddStudent);
studentsRouter.get("/students", requireRole("parent"), handleListMyStudents);
