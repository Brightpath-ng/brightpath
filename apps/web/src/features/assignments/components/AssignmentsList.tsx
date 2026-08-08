"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Link2 } from "lucide-react";
import { Badge } from "@brightpath/ui";
import type { Assignment } from "@brightpath/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PersonAvatar } from "./PersonAvatar";

interface AssignmentsListProps {
  assignments: Assignment[];
}

export function AssignmentsList({ assignments }: AssignmentsListProps) {
  const router = useRouter();

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pairing</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((assignment) => (
          <TableRow
            key={assignment.id}
            onClick={() => router.push(`/admin/assignments/${assignment.id}`)}
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex shrink-0 items-center gap-2">
                  <PersonAvatar />
                  <Link2
                    aria-hidden="true"
                    className="size-3.5 shrink-0"
                    style={{ color: "var(--text-tertiary)" }}
                  />
                  <PersonAvatar />
                </div>
                <Link
                  href={`/admin/assignments/${assignment.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="truncate text-sm font-medium hover:underline"
                  style={{ color: "var(--text-primary)" }}
                >
                  {assignment.student.name} &amp; {assignment.tutor.name}
                </Link>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={assignment.status === "ACTIVE" ? "success" : "default"}>
                {assignment.status === "ACTIVE" ? "Active" : "Ended"}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {new Date(assignment.assignedAt).toLocaleDateString()}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
