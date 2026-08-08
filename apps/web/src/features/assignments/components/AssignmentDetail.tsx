import { Link2 } from "lucide-react";
import { Badge } from "@brightpath/ui";
import type { Assignment } from "@brightpath/types";
import { PersonAvatar } from "./PersonAvatar";

interface AssignmentDetailProps {
  assignment: Assignment;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="text-xs font-semibold uppercase"
        style={{ color: "var(--text-tertiary)", letterSpacing: "0.04em" }}
      >
        {label}
      </p>
      <p className="mt-1 text-sm" style={{ color: "var(--text-primary)" }}>
        {value}
      </p>
    </div>
  );
}

function HeroPerson({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
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

export function AssignmentDetail({ assignment }: AssignmentDetailProps) {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="flex items-center gap-4">
          <HeroPerson name={assignment.student.name} role="Student" />
          <Link2 aria-hidden="true" className="size-5 shrink-0" style={{ color: "var(--text-tertiary)" }} />
          <HeroPerson name={assignment.tutor.name} role="Tutor" />
        </div>
        <Badge variant={assignment.status === "ACTIVE" ? "success" : "default"}>
          {assignment.status === "ACTIVE" ? "Active" : "Ended"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field
          label="Subjects"
          value={assignment.tutor.subjects.length > 0 ? assignment.tutor.subjects.join(", ") : "Not specified"}
        />
        <Field label="Assigned" value={new Date(assignment.assignedAt).toLocaleDateString()} />
        <Field
          label="Ended"
          value={assignment.endedAt ? new Date(assignment.endedAt).toLocaleDateString() : "Not ended"}
        />
      </div>
    </div>
  );
}
