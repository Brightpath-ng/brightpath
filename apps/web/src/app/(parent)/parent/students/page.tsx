import { PageHeader } from "@/components/PageHeader";
import { listMyStudents } from "@/features/students/api/list-students";
import { StudentsPageContent } from "@/features/students/components/StudentsPageContent";

export default async function ParentStudentsPage() {
  try {
    const students = await listMyStudents();
    return <StudentsPageContent students={students} />;
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
