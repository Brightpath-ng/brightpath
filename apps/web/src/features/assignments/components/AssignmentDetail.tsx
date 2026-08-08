import { Badge } from "@brightpath/ui";
import type { Assignment } from "@brightpath/types";

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

export function AssignmentDetail({ assignment }: AssignmentDetailProps) {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Badge variant={assignment.status === "ACTIVE" ? "success" : "default"} className="w-fit">
        {assignment.status === "ACTIVE" ? "Active" : "Ended"}
      </Badge>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Student" value={assignment.student.name} />
        <Field
          label="Tutor"
          value={
            assignment.tutor.subjects.length > 0
              ? `${assignment.tutor.name} (${assignment.tutor.subjects.join(", ")})`
              : assignment.tutor.name
          }
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
