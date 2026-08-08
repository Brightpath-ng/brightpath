"use client";

import { useState, useTransition } from "react";
import { Button } from "@brightpath/ui";
import type { TutorApplicationSummary } from "@brightpath/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Applicant</TableHead>
          <TableHead>Subjects</TableHead>
          <TableHead>Qualifications</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <ApplicationRow key={application.id} application={application} />
        ))}
      </TableBody>
    </Table>
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
    <TableRow>
      <TableCell>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {application.name}
        </p>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {application.email}
        </p>
      </TableCell>
      <TableCell>{application.subjects.join(", ")}</TableCell>
      <TableCell>{application.qualifications}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
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
          {error ? (
            <p role="alert" className="text-xs" style={{ color: "var(--red)" }}>
              {error}
            </p>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}
