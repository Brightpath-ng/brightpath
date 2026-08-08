import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getAssignment } from "@/features/assignments/api/get-assignment";
import { listAssignments } from "@/features/assignments/api/list-assignments";
import { AssignmentDetail } from "@/features/assignments/components/AssignmentDetail";
import { EndAssignmentButton } from "@/features/assignments/components/EndAssignmentButton";

interface AssignmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssignmentDetailPage({ params }: AssignmentDetailPageProps) {
  const { id } = await params;

  try {
    const [assignment, allAssignments] = await Promise.all([getAssignment(id), listAssignments()]);
    return (
      <>
        <PageHeader
          title={`${assignment.student.name} & ${assignment.tutor.name}`}
          description={
            assignment.status === "ACTIVE" ? "Currently assigned." : "This assignment has ended."
          }
          backHref="/admin/assignments"
          backLabel="Matching"
          action={
            assignment.status === "ACTIVE" ? (
              <EndAssignmentButton
                assignmentId={assignment.id}
                studentName={assignment.student.name}
                tutorName={assignment.tutor.name}
              />
            ) : (
              <Link
                href={`/admin/assignments/new?studentId=${assignment.student.id}`}
                className="inline-block rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium"
                style={{ background: "var(--accent)", color: "var(--text-on-accent)" }}
              >
                Reassign
              </Link>
            )
          }
        />
        <div className="p-8">
          <AssignmentDetail assignment={assignment} allAssignments={allAssignments} />
        </div>
      </>
    );
  } catch {
    return (
      <>
        <PageHeader
          title="Assignment"
          description="We couldn't load this assignment."
          backHref="/admin/assignments"
          backLabel="Matching"
        />
        <div className="p-8">
          <a
            href={`/admin/assignments/${id}`}
            className="inline-block rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium"
            style={{ background: "var(--accent)", color: "var(--text-on-accent)" }}
          >
            Try again
          </a>
        </div>
      </>
    );
  }
}
