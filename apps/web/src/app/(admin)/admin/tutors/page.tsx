import { currentUser } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/DashboardShell";
import { listPendingApplications } from "@/features/tutors/api/list-applications";
import { TutorApplicationsList } from "@/features/tutors/components/TutorApplicationsList";

export default async function AdminTutorsPage() {
  const user = await currentUser();
  const greeting = `Welcome, ${user?.firstName ?? "Admin"}`;

  try {
    const applications = await listPendingApplications();
    return (
      <DashboardShell
        brandLabel="BrightPath Admin"
        greeting={greeting}
        description="Pending tutor applications."
      >
        <TutorApplicationsList applications={applications} />
      </DashboardShell>
    );
  } catch {
    return (
      <DashboardShell
        brandLabel="BrightPath Admin"
        greeting={greeting}
        description="We couldn't load pending applications."
      >
        <a
          href="/admin/tutors"
          className="inline-block rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium"
          style={{ background: "var(--accent)", color: "var(--text-on-accent)" }}
        >
          Try again
        </a>
      </DashboardShell>
    );
  }
}
