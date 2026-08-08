import { PageHeader } from "@/components/PageHeader";
import { LinkButton } from "@/components/LinkButton";
import { listMyStudents } from "@/features/students/api/list-students";
import { StudentsList } from "@/features/students/components/StudentsList";

export default async function ParentStudentsPage() {
  try {
    const students = await listMyStudents();
    return (
      <>
        <PageHeader
          title="My Students"
          description="The children you manage on BrightPath."
          action={<LinkButton href="/parent/students/new">Add child</LinkButton>}
        />
        <div className="p-8">
          <StudentsList students={students} />
        </div>
      </>
    );
  } catch {
    return (
      <>
        <PageHeader title="My Students" description="We couldn't load your children." />
        <div className="p-8">
          <a
            href="/parent/students"
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
