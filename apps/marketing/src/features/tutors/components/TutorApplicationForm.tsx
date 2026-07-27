"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Button, Input, Label } from "@brightpath/ui";
import { TutorApplicationInputSchema } from "@brightpath/types";

type Status = "idle" | "submitting" | "success" | "error";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const textareaClassName =
  "w-full rounded-[var(--radius-md)] border border-[var(--bg-border)] bg-[var(--bg-surface)] " +
  "px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-all duration-150 " +
  "placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)] " +
  "focus:ring-2 focus:ring-[var(--accent-dim)]";

export function TutorApplicationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [qualifications, setQualifications] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function addSubject() {
    const value = subjectInput.trim();
    if (value && !subjects.includes(value)) {
      setSubjects([...subjects, value]);
    }
    setSubjectInput("");
  }

  function removeSubject(subject: string) {
    setSubjects(subjects.filter((existing) => existing !== subject));
  }

  function handleSubjectKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSubject();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const input = {
      firstName,
      lastName,
      email,
      phone,
      subjects,
      qualifications,
      bio: bio || undefined,
    };

    const parsed = TutorApplicationInputSchema.safeParse(input);
    if (!parsed.success) {
      setErrorMessage(
        "Please check the form: " + parsed.error.issues.map((issue) => issue.message).join(", ")
      );
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(`${API_URL}/tutors/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (response.status === 409) {
        setErrorMessage("An application already exists for this email address.");
        setStatus("error");
        return;
      }

      if (!response.ok) {
        setErrorMessage("Something went wrong submitting your application. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("Couldn't reach BrightPath. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="mx-auto max-w-xl p-8 text-center"
        style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-md)" }}
      >
        <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Application received
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Thanks for applying to teach with BrightPath. Our team will review your application and
          reach out once it&rsquo;s been decided.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subjects">Subjects you teach</Label>
        <Input
          id="subjects"
          value={subjectInput}
          onChange={(e) => setSubjectInput(e.target.value)}
          onKeyDown={handleSubjectKeyDown}
          onBlur={addSubject}
          placeholder="Type a subject and press Enter"
        />
        {subjects.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <li
                key={subject}
                className="flex items-center gap-1 rounded-[var(--radius-full)] px-3 py-1 text-xs"
                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
              >
                {subject}
                <button
                  type="button"
                  aria-label={`Remove ${subject}`}
                  onClick={() => removeSubject(subject)}
                >
                  <X aria-hidden="true" className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="qualifications">Qualifications & experience</Label>
        <textarea
          id="qualifications"
          value={qualifications}
          onChange={(e) => setQualifications(e.target.value)}
          rows={4}
          className={textareaClassName}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">
          Bio <span style={{ color: "var(--text-tertiary)" }}>(optional)</span>
        </Label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className={textareaClassName}
        />
      </div>

      {status === "error" && errorMessage ? (
        <p role="alert" className="text-sm" style={{ color: "var(--red)" }}>
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" size="lg" loading={status === "submitting"}>
        {status === "submitting" ? "Submitting..." : "Submit application"}
      </Button>
    </form>
  );
}
