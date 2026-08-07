"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Button, Input, Label } from "@brightpath/ui";
import { AddStudentInputSchema } from "@brightpath/types";
import { addStudent } from "../api/actions";

const textareaClassName =
  "w-full rounded-[var(--radius-md)] border border-[var(--bg-border)] bg-[var(--bg-surface)] " +
  "px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-all duration-150 " +
  "placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)] " +
  "focus:ring-2 focus:ring-[var(--accent-dim)]";

interface AddStudentFormProps {
  onSuccess?: () => void;
}

export function AddStudentForm({ onSuccess }: AddStudentFormProps) {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [learningChallenges, setLearningChallenges] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [addedName, setAddedName] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setAddedName(null);

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
        await addStudent(parsed.data);
        setAddedName(parsed.data.name);
        setName("");
        setSchool("");
        setStudentClass("");
        setLearningGoals("");
        setLearningChallenges("");
        onSuccess?.();
      } catch {
        setError("Couldn't add this child. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
      {addedName ? (
        <p className="text-sm" style={{ color: "var(--accent)" }}>
          Added {addedName}.
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} loading={isPending} className="self-start">
        {isPending ? "Adding..." : "Add child"}
      </Button>
    </form>
  );
}
