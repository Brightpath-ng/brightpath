import { currentUser } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/DashboardShell";
import { listMyStudents } from "@/features/students/api/list-students";
import { AddStudentForm } from "@/features/students/components/AddStudentForm";
import { StudentsList } from "@/features/students/components/StudentsList";

export default async function ParentStudentsPage() {
  const user = await currentUser();
  const greeting = `Welcome, ${user?.firstName ?? "there"}`;

  try {
    const students = await listMyStudents();
    return (
      <DashboardShell brandLabel="BrightPath" greeting={greeting} description="My students.">
        <div className="flex flex-col gap-8">
          <AddStudentForm />
          <StudentsList students={students} />
        </div>
      </DashboardShell>
    );
  } catch {
    return (
      <DashboardShell
        brandLabel="BrightPath"
        greeting={greeting}
        description="We couldn't load your children."
      >
        <a
          href="/parent/students"
          className="inline-block rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium"
          style={{ background: "var(--accent)", color: "var(--text-on-accent)" }}
        >
          Try again
        </a>
      </DashboardShell>
    );
  }
}
