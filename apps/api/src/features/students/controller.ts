import type { Request, Response } from "express";
import type { StudentProfile } from "@brightpath/db";
import { AddStudentInputSchema } from "@brightpath/types";
import { createStudentsService, ParentNotFoundError, StudentNotFoundError } from "./service.js";
import * as repository from "./repository.js";

function getStudentsService() {
  return createStudentsService({
    findUserByClerkId: repository.findUserByClerkId,
    createStudentProfile: repository.createStudentProfile,
    listStudentProfilesByParentId: repository.listStudentProfilesByParentId,
    findStudentProfileById: repository.findStudentProfileById,
    updateStudentProfile: repository.updateStudentProfile,
  });
}

function toStudentProfileDTO(profile: StudentProfile) {
  return {
    id: profile.id,
    parentId: profile.parentId,
    name: profile.name,
    school: profile.school,
    class: profile.class,
    learningGoals: profile.learningGoals,
    learningChallenges: profile.learningChallenges,
    learningTrack: profile.learningTrack,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

// requireRole("parent") already guarantees req.auth is set before these run.

export async function handleAddStudent(req: Request, res: Response) {
  const parsed = AddStudentInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid student", details: parsed.error.flatten() });
    return;
  }

  try {
    const profile = await getStudentsService().addStudent(req.auth!.userId, parsed.data);
    res.status(201).json(toStudentProfileDTO(profile));
  } catch (error) {
    if (error instanceof ParentNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Failed to add student", error);
    res.status(500).json({ error: "Internal error" });
  }
}

export async function handleListMyStudents(req: Request, res: Response) {
  try {
    const students = await getStudentsService().listMyStudents(req.auth!.userId);
    res.status(200).json(students.map(toStudentProfileDTO));
  } catch (error) {
    if (error instanceof ParentNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Failed to list students", error);
    res.status(500).json({ error: "Internal error" });
  }
}

export async function handleGetStudent(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: "Missing student id" });
    return;
  }

  try {
    const student = await getStudentsService().getStudent(req.auth!.userId, id);
    res.status(200).json(toStudentProfileDTO(student));
  } catch (error) {
    if (error instanceof ParentNotFoundError || error instanceof StudentNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Failed to get student", error);
    res.status(500).json({ error: "Internal error" });
  }
}

export async function handleUpdateStudent(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: "Missing student id" });
    return;
  }

  const parsed = AddStudentInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid student", details: parsed.error.flatten() });
    return;
  }

  try {
    const student = await getStudentsService().updateStudent(req.auth!.userId, id, parsed.data);
    res.status(200).json(toStudentProfileDTO(student));
  } catch (error) {
    if (error instanceof ParentNotFoundError || error instanceof StudentNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Failed to update student", error);
    res.status(500).json({ error: "Internal error" });
  }
}
