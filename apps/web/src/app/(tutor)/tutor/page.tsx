import { currentUser } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/DashboardShell";
import { getMyTutorProfile } from "@/features/tutors/api/get-my-profile";
import { TutorStatusCard } from "@/features/tutors/components/TutorStatusCard";

export default async function TutorDashboardPage() {
  const user = await currentUser();
  const greeting = `Welcome, ${user?.firstName ?? "there"}`;

  try {
    const profile = await getMyTutorProfile();
    return (
      <DashboardShell
        brandLabel="BrightPath Tutor"
        greeting={greeting}
        description="Your application status and next steps."
      >
        <TutorStatusCard status={profile.status} />
      </DashboardShell>
    );
  } catch {
    return (
      <DashboardShell
        brandLabel="BrightPath Tutor"
        greeting={greeting}
        description="We couldn't load your application status."
      >
        <a
          href="/tutor"
          className="inline-block rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium"
          style={{ background: "var(--accent)", color: "var(--text-on-accent)" }}
        >
          Try again
        </a>
      </DashboardShell>
    );
  }
}
