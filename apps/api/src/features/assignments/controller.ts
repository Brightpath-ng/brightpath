import type { Request, Response } from "express";
import { AssignStudentInputSchema } from "@brightpath/types";
import {
  createAssignmentsService,
  AdminNotFoundError,
  StudentNotFoundError,
  TutorNotEligibleError,
  AssignmentNotFoundError,
  AssignmentAlreadyEndedError,
} from "./service.js";
import * as repository from "./repository.js";
import type { AssignmentRecord } from "./repository.js";

function getAssignmentsService() {
  return createAssignmentsService({
    findUserByClerkId: repository.findUserByClerkId,
    findStudentProfileById: repository.findStudentProfileById,
    findTutorProfileById: repository.findTutorProfileById,
    assignTutorToStudent: repository.assignTutorToStudent,
    endAssignment: repository.endAssignment,
    findAssignmentById: repository.findAssignmentById,
    listAssignments: repository.listAssignments,
  });
}

function toAssignmentDTO(record: AssignmentRecord) {
  return {
    id: record.id,
    status: record.status,
    assignedById: record.assignedById,
    assignedAt: record.assignedAt.toISOString(),
    endedAt: record.endedAt ? record.endedAt.toISOString() : null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    student: { id: record.student.id, name: record.student.name },
    tutor: {
      id: record.tutor.id,
      name: record.tutor.user.name,
      subjects: record.tutor.subjects,
    },
  };
}

// requireRole("admin") already guarantees req.auth is set before these run.

export async function handleAssignTutor(req: Request, res: Response) {
  const parsed = AssignStudentInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid assignment", details: parsed.error.flatten() });
    return;
  }

  try {
    const assignment = await getAssignmentsService().assignTutor(req.auth!.userId, parsed.data);
    res.status(201).json(toAssignmentDTO(assignment));
  } catch (error) {
    if (
      error instanceof AdminNotFoundError ||
      error instanceof StudentNotFoundError ||
      error instanceof TutorNotEligibleError
    ) {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Failed to assign tutor", error);
    res.status(500).json({ error: "Internal error" });
  }
}

export async function handleListAssignments(_req: Request, res: Response) {
  try {
    const assignments = await getAssignmentsService().listAssignments();
    res.status(200).json(assignments.map(toAssignmentDTO));
  } catch (error) {
    console.error("Failed to list assignments", error);
    res.status(500).json({ error: "Internal error" });
  }
}

export async function handleGetAssignment(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: "Missing assignment id" });
    return;
  }

  try {
    const assignment = await getAssignmentsService().getAssignment(id);
    res.status(200).json(toAssignmentDTO(assignment));
  } catch (error) {
    if (error instanceof AssignmentNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Failed to get assignment", error);
    res.status(500).json({ error: "Internal error" });
  }
}

export async function handleEndAssignment(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: "Missing assignment id" });
    return;
  }

  try {
    const assignment = await getAssignmentsService().unassign(id);
    res.status(200).json(toAssignmentDTO(assignment));
  } catch (error) {
    if (error instanceof AssignmentNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    if (error instanceof AssignmentAlreadyEndedError) {
      res.status(409).json({ error: error.message });
      return;
    }
    console.error("Failed to end assignment", error);
    res.status(500).json({ error: "Internal error" });
  }
}
