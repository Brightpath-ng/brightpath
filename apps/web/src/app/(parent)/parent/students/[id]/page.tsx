import { PageHeader } from "@/components/PageHeader";
import { LinkButton } from "@/components/LinkButton";
import { getStudent } from "@/features/students/api/get-student";
import { StudentDetail } from "@/features/students/components/StudentDetail";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params;

  try {
    const student = await getStudent(id);
    return (
      <>
        <PageHeader
          title={student.name}
          description={
            [student.school, student.class].filter(Boolean).join(" · ") || "No school on file"
          }
          backHref="/parent/students"
          backLabel="My Students"
          action={<LinkButton href={`/parent/students/${student.id}/edit`}>Edit</LinkButton>}
        />
        <div className="p-8">
          <StudentDetail student={student} />
        </div>
      </>
    );
  } catch {
    return (
      <>
        <PageHeader
          title="Student"
          description="We couldn't load this child."
          backHref="/parent/students"
          backLabel="My Students"
        />
        <div className="p-8">
          <a
            href={`/parent/students/${id}`}
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
