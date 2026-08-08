import { PageHeader } from "@/components/PageHeader";
import { AddStudentForm } from "@/features/students/components/AddStudentForm";

export default function NewStudentPage() {
  return (
    <>
      <PageHeader
        title="Add a child"
        description="Add your child's details so we can match them with the right tutor."
        backHref="/parent/students"
        backLabel="My Students"
      />
      <div className="p-8">
        <AddStudentForm />
      </div>
    </>
  );
}
