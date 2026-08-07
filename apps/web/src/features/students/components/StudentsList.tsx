import { Badge } from "@brightpath/ui";
import type { StudentProfile } from "@brightpath/types";

interface StudentsListProps {
  students: StudentProfile[];
}

const TRACK_LABELS: Record<StudentProfile["learningTrack"], string> = {
  tutor_led: "Tutor-led",
  hybrid: "Hybrid",
  self_directed: "Self-directed",
};

export function StudentsList({ students }: StudentsListProps) {
  if (students.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        No children added yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-[var(--bg-border-subtle)]">
      {students.map((student) => (
        <li key={student.id} className="flex items-center gap-3.5 py-4">
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
          >
            {student.name.charAt(0).toUpperCase()}
          </div>
          <p className="flex-1 truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {student.name}
          </p>
          <Badge variant="accent" className="shrink-0">
            {TRACK_LABELS[student.learningTrack]}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
