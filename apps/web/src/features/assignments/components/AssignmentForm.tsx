"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Link2 } from "lucide-react";
import { Button, Label } from "@brightpath/ui";
import type { Assignment, StudentProfile, TutorApplicationSummary } from "@brightpath/types";
import { Select, type SelectOption } from "@/components/ui/select";
import { assignTutor } from "../api/actions";
import { PersonAvatar } from "./PersonAvatar";

interface AssignmentFormProps {
  students: StudentProfile[];
  tutors: TutorApplicationSummary[];
  assignments: Assignment[];
  initialStudentId?: string;
}

function studentMeta(student: StudentProfile): string | undefined {
  if (student.school && student.class) return `${student.school} · ${student.class}`;
  return student.school ?? undefined;
}

export function AssignmentForm({ students, tutors, assignments, initialStudentId }: AssignmentFormProps) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(initialStudentId ?? "");
  const [tutorId, setTutorId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (students.length === 0 || tutors.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {students.length === 0
          ? "No students have been added yet."
          : "No approved tutors yet -- approve a tutor application first."}
      </p>
    );
  }

  const studentOptions: SelectOption[] = students.map((student) => ({
    id: student.id,
    label: student.name,
    meta: studentMeta(student),
  }));

  const tutorOptions: SelectOption[] = tutors.map((tutor) => ({
    id: tutor.id,
    label: tutor.name,
    meta: tutor.subjects.length > 0 ? tutor.subjects.join(", ") : undefined,
  }));

  const selectedStudent = students.find((student) => student.id === studentId) ?? null;
  const selectedTutor = tutors.find((tutor) => tutor.id === tutorId) ?? null;
  const existingAssignment =
    selectedStudent
      ? (assignments.find(
          (assignment) => assignment.status === "ACTIVE" && assignment.student.id === selectedStudent.id
        ) ?? null)
      : null;
  const isReassignment = existingAssignment !== null && existingAssignment.tutor.id !== selectedTutor?.id;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!studentId || !tutorId) {
      setError("Choose both a student and a tutor.");
      return;
    }

    startTransition(async () => {
      try {
        const assignment = await assignTutor({ studentId, tutorId });
        router.push(`/admin/assignments/${assignment.id}`);
      } catch {
        setError("Couldn't create this assignment. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="assignmentStudent">Student</Label>
        <Select
          id="assignmentStudent"
          options={studentOptions}
          value={studentId}
          onChange={setStudentId}
          placeholder="Select a student"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="assignmentTutor">Tutor</Label>
        <Select
          id="assignmentTutor"
          options={tutorOptions}
          value={tutorId}
          onChange={setTutorId}
          placeholder="Select a tutor"
        />
      </div>

      {selectedStudent && selectedTutor ? (
        <div
          className="flex items-center gap-3 rounded-[var(--radius-lg)] border p-4"
          style={
            isReassignment
              ? { borderColor: "var(--amber-border)", background: "var(--amber-bg)" }
              : { borderColor: "var(--bg-border-subtle)", background: "var(--bg-elevated)" }
          }
        >
          <div className="flex items-center gap-2">
            <PersonAvatar />
            <Link2 aria-hidden="true" className="size-4 shrink-0" style={{ color: "var(--text-tertiary)" }} />
            <PersonAvatar />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {selectedStudent.name} &amp; {selectedTutor.name}
            </p>
            <p className="text-xs" style={{ color: isReassignment ? "var(--amber)" : "var(--text-secondary)" }}>
              {isReassignment
                ? `Currently assigned to ${existingAssignment!.tutor.name} -- assigning ${selectedTutor.name} will end that assignment.`
                : existingAssignment
                  ? `Already assigned to ${selectedTutor.name}.`
                  : "Ready to assign."}
            </p>
          </div>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm" style={{ color: "var(--red)" }}>
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} loading={isPending} className="self-start">
        {isPending ? "Assigning..." : "Assign tutor"}
      </Button>
    </form>
  );
}
