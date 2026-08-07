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
    <ul className="flex flex-col gap-4">
      {students.map((student) => (
        <li
          key={student.id}
          className="flex flex-col gap-2 rounded-[var(--radius-md)] border p-4"
          style={{ borderColor: "var(--bg-border)" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {student.name}
              </p>
              {student.school || student.class ? (
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {[student.school, student.class].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </div>
            <Badge className="shrink-0">{TRACK_LABELS[student.learningTrack]}</Badge>
          </div>
          {student.learningGoals ? (
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Goals: {student.learningGoals}
            </p>
          ) : null}
          {student.learningChallenges ? (
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Challenges: {student.learningChallenges}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
