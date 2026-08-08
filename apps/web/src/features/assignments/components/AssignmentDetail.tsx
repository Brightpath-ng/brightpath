import type { ReactNode } from "react";
import Link from "next/link";
import { Link2 } from "lucide-react";
import { Badge } from "@brightpath/ui";
import type { Assignment } from "@brightpath/types";
import { PersonAvatar } from "./PersonAvatar";

interface AssignmentDetailProps {
  assignment: Assignment;
  allAssignments: Assignment[];
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex-1 border-r px-4 py-3 last:border-r-0"
      style={{ borderColor: "var(--bg-border-subtle)" }}
    >
      <p
        className="text-[10.5px] font-semibold uppercase"
        style={{ color: "var(--text-tertiary)", letterSpacing: "0.04em" }}
      >
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
        {value}
      </p>
    </div>
  );
}

function HeroPerson({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <PersonAvatar size="lg" />
      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {name}
        </p>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {role}
        </p>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-lg)] border" style={{ borderColor: "var(--bg-border-subtle)" }}>
      <p
        className="border-b px-4 py-2.5 text-xs font-bold uppercase"
        style={{ borderColor: "var(--bg-border-subtle)", color: "var(--text-tertiary)", letterSpacing: "0.03em" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

export function AssignmentDetail({ assignment, allAssignments }: AssignmentDetailProps) {
  const tutorOtherActive = allAssignments.filter(
    (a) => a.status === "ACTIVE" && a.tutor.id === assignment.tutor.id && a.id !== assignment.id
  );

  const studentHistory = [...allAssignments]
    .filter((a) => a.student.id === assignment.student.id)
    .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime());

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex items-center gap-4">
          <HeroPerson name={assignment.student.name} role="Student" />
          <Link2 aria-hidden="true" className="size-5 shrink-0" style={{ color: "var(--text-tertiary)" }} />
          <HeroPerson name={assignment.tutor.name} role="Tutor" />
        </div>
        <Badge variant={assignment.status === "ACTIVE" ? "success" : "default"}>
          {assignment.status === "ACTIVE" ? "Active" : "Ended"}
        </Badge>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          Assigned by {assignment.assignedBy.name} on{" "}
          {new Date(assignment.assignedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex rounded-[var(--radius-lg)] border" style={{ borderColor: "var(--bg-border-subtle)" }}>
        <Fact
          label="Subjects"
          value={assignment.tutor.subjects.length > 0 ? assignment.tutor.subjects.join(", ") : "Not specified"}
        />
        <Fact label="Assigned" value={new Date(assignment.assignedAt).toLocaleDateString()} />
        <Fact
          label="Ended"
          value={assignment.endedAt ? new Date(assignment.endedAt).toLocaleDateString() : "Not ended"}
        />
      </div>

      <SectionCard title={`${assignment.tutor.name} is also tutoring`}>
        {tutorOtherActive.length === 0 ? (
          <p className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            Not currently tutoring any other students.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--bg-border-subtle)]">
            {tutorOtherActive.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-4 py-2.5">
                <PersonAvatar size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {a.student.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    Since {new Date(a.assignedAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/admin/assignments/${a.id}`}
                  className="shrink-0 text-xs font-medium"
                  style={{ color: "var(--accent)" }}
                >
                  View &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title={`History for ${assignment.student.name}`}>
        <div className="flex flex-col gap-4 px-4 py-4">
          {studentHistory.map((a) => (
            <div key={a.id} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-1 size-2.5 shrink-0 rounded-full"
                style={{ background: a.status === "ACTIVE" ? "var(--green)" : "var(--text-tertiary)" }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Assigned to {a.tutor.name}
                </p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {a.status === "ACTIVE"
                    ? `${new Date(a.assignedAt).toLocaleDateString()} · Active`
                    : `${new Date(a.assignedAt).toLocaleDateString()} – ${
                        a.endedAt ? new Date(a.endedAt).toLocaleDateString() : ""
                      } · Ended`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
