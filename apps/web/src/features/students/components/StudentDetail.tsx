import { Badge } from "@brightpath/ui";
import type { StudentProfile } from "@brightpath/types";

interface StudentDetailProps {
  student: StudentProfile;
}

const TRACK_LABELS: Record<StudentProfile["learningTrack"], string> = {
  tutor_led: "Tutor-led",
  hybrid: "Hybrid",
  self_directed: "Self-directed",
};

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

export function StudentDetail({ student }: StudentDetailProps) {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Badge variant="accent" className="w-fit">
        {TRACK_LABELS[student.learningTrack]}
      </Badge>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="School" value={student.school ?? "Not on file"} />
        <Field label="Class" value={student.class ?? "Not on file"} />
      </div>

      <Field label="Learning goals" value={student.learningGoals ?? "Not on file"} />
      <Field label="Learning challenges" value={student.learningChallenges ?? "Not on file"} />
    </div>
  );
}
