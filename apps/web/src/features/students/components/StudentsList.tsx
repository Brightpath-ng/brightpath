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

const columns = "grid-cols-[1fr_180px_120px_120px]";

export function StudentsList({ students }: StudentsListProps) {
  if (students.length === 0) {
    return (
      <div
        className="flex max-w-4xl flex-col items-start gap-2 rounded-[var(--radius-lg)] border p-8"
        style={{
          borderColor: "var(--bg-border-subtle)",
          background: "var(--bg-surface)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          No children added yet.
        </p>
        <Link
          href="/parent/students/new"
          className="text-sm font-medium"
          style={{ color: "var(--accent)" }}
        >
          Add your first child &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl overflow-hidden rounded-[var(--radius-lg)] border"
      style={{
        borderColor: "var(--bg-border-subtle)",
        background: "var(--bg-surface)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        className={`grid ${columns} gap-4 px-4 py-3`}
        style={{ borderBottom: "1px solid var(--bg-border-subtle)" }}
      >
        <span
          className="text-xs font-semibold uppercase"
          style={{ color: "var(--text-tertiary)", letterSpacing: "0.04em" }}
        >
          Student
        </span>
        <span
          className="text-xs font-semibold uppercase"
          style={{ color: "var(--text-tertiary)", letterSpacing: "0.04em" }}
        >
          School
        </span>
        <span
          className="text-xs font-semibold uppercase"
          style={{ color: "var(--text-tertiary)", letterSpacing: "0.04em" }}
        >
          Class
        </span>
        <span
          className="text-xs font-semibold uppercase"
          style={{ color: "var(--text-tertiary)", letterSpacing: "0.04em" }}
        >
          Track
        </span>
      </div>

      <div className="flex flex-col divide-y divide-[var(--bg-border-subtle)]">
        {students.map((student) => (
          <Link
            key={student.id}
            href={`/parent/students/${student.id}`}
            className={`grid ${columns} items-center gap-4 px-4 py-3 transition-colors hover:bg-[var(--bg-elevated)]`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
              >
                {student.name.charAt(0).toUpperCase()}
              </div>
              <span
                className="truncate text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {student.name}
              </span>
            </div>
            <span
              className="truncate text-sm"
              style={{ color: student.school ? "var(--text-secondary)" : "var(--text-tertiary)" }}
            >
              {student.school ?? "—"}
            </span>
            <span
              className="truncate text-sm"
              style={{ color: student.class ? "var(--text-secondary)" : "var(--text-tertiary)" }}
            >
              {student.class ?? "—"}
            </span>
            <Badge variant="accent" className="w-fit">
              {TRACK_LABELS[student.learningTrack]}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
