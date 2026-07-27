"use client";

import { useState, useTransition } from "react";
import { Button } from "@brightpath/ui";
import type { TutorApplicationSummary } from "@brightpath/types";
import { approveTutorApplication, rejectTutorApplication } from "../api/actions";

interface TutorApplicationsListProps {
  applications: TutorApplicationSummary[];
}

export function TutorApplicationsList({ applications }: TutorApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        No pending applications.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {applications.map((application) => (
        <ApplicationRow key={application.id} application={application} />
      ))}
    </ul>
  );
}

function ApplicationRow({ application }: { application: TutorApplicationSummary }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function decide(action: (id: string) => Promise<void>, failureMessage: string) {
    setError(null);
    startTransition(async () => {
      try {
        await action(application.id);
      } catch {
        setError(failureMessage);
      }
    });
  }

  return (
    <li
      className="flex flex-col gap-2 rounded-[var(--radius-md)] border p-4"
      style={{ borderColor: "var(--bg-border)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {application.name}
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {application.email}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            disabled={isPending}
            loading={isPending}
            onClick={() => decide(approveTutorApplication, "Couldn't approve this application.")}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={isPending}
            onClick={() => decide(rejectTutorApplication, "Couldn't reject this application.")}
          >
            Reject
          </Button>
        </div>
      </div>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {application.subjects.join(", ")}
      </p>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {application.qualifications}
      </p>
      {error ? (
        <p role="alert" className="text-sm" style={{ color: "var(--red)" }}>
          {error}
        </p>
      ) : null}
    </li>
  );
}
