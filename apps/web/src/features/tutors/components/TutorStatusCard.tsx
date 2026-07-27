import type { TutorApplicationStatus } from "@brightpath/types";

interface TutorStatusCardProps {
  status: TutorApplicationStatus;
}

export function TutorStatusCard({ status }: TutorStatusCardProps) {
  if (status === "PENDING") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Application under review
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Our team reviews every application before you&rsquo;re matched with students.
          We&rsquo;ll notify you once a decision has been made.
        </p>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Application not approved
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Your application wasn&rsquo;t approved this time.
        </p>
      </div>
    );
  }

  return (
    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
      Your schedule, assigned students, and lesson reports will land here.
    </p>
  );
}
