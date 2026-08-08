import { PageHeader } from "@/components/PageHeader";
import { listAllStudentsForPicker } from "@/features/assignments/api/list-students-for-picker";
import { listApprovedTutorsForPicker } from "@/features/assignments/api/list-tutors-for-picker";
import { AssignmentForm } from "@/features/assignments/components/AssignmentForm";

export default async function NewAssignmentPage() {
  try {
    const [students, tutors] = await Promise.all([
      listAllStudentsForPicker(),
      listApprovedTutorsForPicker(),
    ]);
    return (
      <>
        <PageHeader
          title="Assign a tutor"
          description="Link an approved tutor to a student."
          backHref="/admin/assignments"
          backLabel="Matching"
        />
        <div className="p-8">
          <AssignmentForm students={students} tutors={tutors} />
        </div>
      </>
    );
  } catch {
    return (
      <>
        <PageHeader
          title="Assign a tutor"
          description="We couldn't load students and tutors."
          backHref="/admin/assignments"
          backLabel="Matching"
        />
        <div className="p-8">
          <a
            href="/admin/assignments/new"
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
