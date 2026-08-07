import { Router } from "express";
import { requireRole } from "../../middleware/require-auth.js";
import {
  handleAddStudent,
  handleListMyStudents,
  handleGetStudent,
  handleUpdateStudent,
} from "./controller.js";

export const studentsRouter: Router = Router();

studentsRouter.post("/students", requireRole("parent"), handleAddStudent);
studentsRouter.get("/students", requireRole("parent"), handleListMyStudents);
studentsRouter.get("/students/:id", requireRole("parent"), handleGetStudent);
studentsRouter.patch("/students/:id", requireRole("parent"), handleUpdateStudent);
