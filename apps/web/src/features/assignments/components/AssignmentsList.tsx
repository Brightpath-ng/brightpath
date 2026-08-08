import Link from "next/link";
import { Link2 } from "lucide-react";
import { Badge } from "@brightpath/ui";
import type { Assignment } from "@brightpath/types";
import { PersonAvatar } from "./PersonAvatar";

interface AssignmentsListProps {
  assignments: Assignment[];
}

export function AssignmentsList({ assignments }: AssignmentsListProps) {
  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          No assignments yet.
        </p>
        <Link
          href="/admin/assignments/new"
          className="text-sm font-medium"
          style={{ color: "var(--accent)" }}
        >
          Assign a tutor &rarr;
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-[var(--bg-border-subtle)]">
      {assignments.map((assignment) => (
        <li key={assignment.id}>
          <Link
            href={`/admin/assignments/${assignment.id}`}
            className="-mx-2 flex items-center gap-4 rounded-[var(--radius-md)] px-2 py-3.5 transition-colors hover:bg-[var(--bg-elevated)]"
          >
            <div className="flex shrink-0 items-center gap-2">
              <PersonAvatar />
              <Link2 aria-hidden="true" className="size-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }} />
              <PersonAvatar />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {assignment.student.name}{" "}
                <span style={{ color: "var(--text-tertiary)" }}>&amp;</span>{" "}
                {assignment.tutor.name}
              </p>
              <p className="truncate text-xs" style={{ color: "var(--text-tertiary)" }}>
                Assigned {new Date(assignment.assignedAt).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={assignment.status === "ACTIVE" ? "success" : "default"} className="shrink-0">
              {assignment.status === "ACTIVE" ? "Active" : "Ended"}
            </Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}
