"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Label } from "@brightpath/ui";
import type { StudentProfile, TutorApplicationSummary } from "@brightpath/types";
import { assignTutor } from "../api/actions";

const selectClassName =
  "w-full rounded-[var(--radius-md)] border border-[var(--bg-border)] bg-[var(--bg-surface)] " +
  "px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-all duration-150 " +
  "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)]";

interface AssignmentFormProps {
  students: StudentProfile[];
  tutors: TutorApplicationSummary[];
}

export function AssignmentForm({ students, tutors }: AssignmentFormProps) {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
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
        <select
          id="assignmentStudent"
          className={selectClassName}
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="assignmentTutor">Tutor</Label>
        <select
          id="assignmentTutor"
          className={selectClassName}
          value={tutorId}
          onChange={(e) => setTutorId(e.target.value)}
        >
          <option value="">Select a tutor</option>
          {tutors.map((tutor) => (
            <option key={tutor.id} value={tutor.id}>
              {tutor.name} ({tutor.subjects.join(", ")})
            </option>
          ))}
        </select>
      </div>

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
