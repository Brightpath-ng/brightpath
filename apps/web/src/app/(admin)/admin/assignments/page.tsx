import { PageHeader } from "@/components/PageHeader";
import { LinkButton } from "@/components/LinkButton";
import { listAssignments } from "@/features/assignments/api/list-assignments";
import { AssignmentsList } from "@/features/assignments/components/AssignmentsList";

export default async function AdminAssignmentsPage() {
  try {
    const assignments = await listAssignments();
    return (
      <>
        <PageHeader
          title="Matching"
          description="Assign tutors to students."
          action={<LinkButton href="/admin/assignments/new">Assign tutor</LinkButton>}
        />
        <div className="p-8">
          <AssignmentsList assignments={assignments} />
        </div>
      </>
    );
  } catch {
    return (
      <>
        <PageHeader title="Matching" description="We couldn't load assignments." />
        <div className="p-8">
          <a
            href="/admin/assignments"
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
