import Link from "next/link";
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
        <li key={student.id}>
          <Link
            href={`/parent/students/${student.id}`}
            className="-mx-2 flex items-center gap-3.5 rounded-[var(--radius-md)] px-2 py-4 transition-colors hover:bg-[var(--bg-elevated)]"
          >
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
              style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
            >
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {student.name}
              </p>
              {student.school || student.class ? (
                <p className="truncate text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {[student.school, student.class].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </div>
            <Badge variant="accent" className="shrink-0">
              {TRACK_LABELS[student.learningTrack]}
            </Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}
