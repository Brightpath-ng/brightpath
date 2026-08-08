"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@brightpath/ui";
import { AddStudentInputSchema, type AddStudentInput } from "@brightpath/types";
import { addStudent, updateStudent } from "../api/actions";

const textareaClassName =
  "w-full rounded-[var(--radius-md)] border border-[var(--bg-border)] bg-[var(--bg-surface)] " +
  "px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-all duration-150 " +
  "placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)] " +
  "focus:ring-2 focus:ring-[var(--accent-dim)]";

interface AddStudentFormProps {
  // Presence of studentId switches the form into edit mode: fields start
  // from initialValues, submit calls updateStudent instead of addStudent,
  // and success returns to the existing record's detail page instead of a
  // freshly created one's.
  studentId?: string;
  initialValues?: AddStudentInput;
}

export function AddStudentForm({ studentId, initialValues }: AddStudentFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(studentId);
  const [name, setName] = useState(initialValues?.name ?? "");
  const [school, setSchool] = useState(initialValues?.school ?? "");
  const [studentClass, setStudentClass] = useState(initialValues?.class ?? "");
  const [learningGoals, setLearningGoals] = useState(initialValues?.learningGoals ?? "");
  const [learningChallenges, setLearningChallenges] = useState(
    initialValues?.learningChallenges ?? ""
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const input = {
      name,
      school: school || undefined,
      class: studentClass || undefined,
      learningGoals: learningGoals || undefined,
      learningChallenges: learningChallenges || undefined,
    };

    const parsed = AddStudentInputSchema.safeParse(input);
    if (!parsed.success) {
      setError("Please check the form: " + parsed.error.issues.map((issue) => issue.message).join(", "));
      return;
    }

    startTransition(async () => {
      try {
        if (studentId) {
          await updateStudent(studentId, parsed.data);
          router.push(`/parent/students/${studentId}`);
        } else {
          const created = await addStudent(parsed.data);
          router.push(`/parent/students/${created.id}`);
        }
      } catch {
        setError(
          isEditMode
            ? "Couldn't save these changes. Please try again."
            : "Couldn't add this child. Please try again."
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="studentName">Name</Label>
          <Input id="studentName" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="studentSchool">
            School <span style={{ color: "var(--text-tertiary)" }}>(optional)</span>
          </Label>
          <Input id="studentSchool" value={school} onChange={(e) => setSchool(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="studentClass">
          Class <span style={{ color: "var(--text-tertiary)" }}>(optional)</span>
        </Label>
        <Input
          id="studentClass"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="learningGoals">
          Learning goals <span style={{ color: "var(--text-tertiary)" }}>(optional)</span>
        </Label>
        <textarea
          id="learningGoals"
          value={learningGoals}
          onChange={(e) => setLearningGoals(e.target.value)}
          rows={2}
          className={textareaClassName}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="learningChallenges">
          Learning challenges <span style={{ color: "var(--text-tertiary)" }}>(optional)</span>
        </Label>
        <textarea
          id="learningChallenges"
          value={learningChallenges}
          onChange={(e) => setLearningChallenges(e.target.value)}
          rows={2}
          className={textareaClassName}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm" style={{ color: "var(--red)" }}>
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} loading={isPending} className="self-start">
        {isPending
          ? isEditMode
            ? "Saving..."
            : "Adding..."
          : isEditMode
            ? "Save changes"
            : "Add child"}
      </Button>
    </form>
  );
}
