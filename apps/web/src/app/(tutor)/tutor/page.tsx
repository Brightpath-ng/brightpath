import { currentUser } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/DashboardShell";

export default async function TutorDashboardPage() {
  const user = await currentUser();

  return (
    <DashboardShell
      brandLabel="BrightPath Tutor"
      greeting={`Welcome, ${user?.firstName ?? "there"}`}
      description="Your schedule, assigned students, and lesson reports will land here."
    />
  );
}
