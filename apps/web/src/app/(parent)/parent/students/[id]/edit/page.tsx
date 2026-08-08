import { PageHeader } from "@/components/PageHeader";
import { getStudent } from "@/features/students/api/get-student";
import { AddStudentForm } from "@/features/students/components/AddStudentForm";

interface EditStudentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params;

  try {
    const student = await getStudent(id);
    return (
      <>
        <PageHeader
          title={`Edit ${student.name}`}
          description="Update your child's details."
          backHref={`/parent/students/${id}`}
          backLabel={student.name}
        />
        <div className="p-8">
          <AddStudentForm
            studentId={student.id}
            initialValues={{
              name: student.name,
              school: student.school ?? undefined,
              class: student.class ?? undefined,
              learningGoals: student.learningGoals ?? undefined,
              learningChallenges: student.learningChallenges ?? undefined,
            }}
          />
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
            href={`/parent/students/${id}/edit`}
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
