import Link from "next/link";
import { User, Plus } from "lucide-react";
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
  return (
    <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {students.map((student) => (
        <Link
          key={student.id}
          href={`/parent/students/${student.id}`}
          className="flex flex-col items-center gap-2.5 rounded-[var(--radius-xl)] border p-6 text-center transition-all duration-150 hover:-translate-y-0.5"
          style={{
            borderColor: "var(--bg-border-subtle)",
            background: "var(--bg-surface)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div
            className="flex size-18 shrink-0 items-center justify-center rounded-full"
            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
          >
            <User aria-hidden="true" className="size-8" />
          </div>
          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {student.name}
          </p>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {[student.school, student.class].filter(Boolean).join(" · ") || "No school on file"}
          </p>
          <Badge variant="accent">{TRACK_LABELS[student.learningTrack]}</Badge>
        </Link>
      ))}

      <Link
        href="/parent/students/new"
        className="flex flex-col items-center justify-center gap-2.5 rounded-[var(--radius-xl)] border-2 border-dashed p-6 text-center transition-colors duration-150 hover:border-[var(--accent)] hover:bg-[var(--accent-dim)] hover:text-[var(--accent)]"
        style={{ borderColor: "var(--bg-border)", color: "var(--text-secondary)" }}
      >
        <div
          className="flex size-18 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--bg-elevated)" }}
        >
          <Plus aria-hidden="true" className="size-6" />
        </div>
        <p className="text-sm font-semibold">Add child</p>
      </Link>
    </div>
  );
}
