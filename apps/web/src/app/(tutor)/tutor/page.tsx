import { currentUser } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/PageHeader";
import { getMyTutorProfile } from "@/features/tutors/api/get-my-profile";
import { TutorStatusCard } from "@/features/tutors/components/TutorStatusCard";

export default async function TutorDashboardPage() {
  const user = await currentUser();
  const greeting = `Welcome, ${user?.firstName ?? "there"}`;

  try {
    const profile = await getMyTutorProfile();
    return (
      <>
        <PageHeader title={greeting} description="Your application status and next steps." />
        <div className="p-8">
          <TutorStatusCard status={profile.status} />
        </div>
      </>
    );
  } catch {
    return (
      <>
        <PageHeader title={greeting} description="We couldn't load your application status." />
        <div className="p-8">
          <a
            href="/tutor"
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
