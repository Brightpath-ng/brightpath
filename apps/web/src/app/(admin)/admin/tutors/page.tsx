import { PageHeader } from "@/components/PageHeader";
import { listPendingApplications } from "@/features/tutors/api/list-applications";
import { TutorApplicationsList } from "@/features/tutors/components/TutorApplicationsList";

export default async function AdminTutorsPage() {
  try {
    const applications = await listPendingApplications();
    return (
      <>
        <PageHeader title="Tutor Applications" description="Pending tutor applications." />
        <div className="p-8">
          <TutorApplicationsList applications={applications} />
        </div>
      </>
    );
  } catch {
    return (
      <>
        <PageHeader
          title="Tutor Applications"
          description="We couldn't load pending applications."
        />
        <div className="p-8">
          <a
            href="/admin/tutors"
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
