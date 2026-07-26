import { currentUser } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/DashboardShell";

export default async function StudentDashboardPage() {
  const user = await currentUser();

  return (
    <DashboardShell
      brandLabel="BrightPath"
      greeting={`Welcome, ${user?.firstName ?? "there"}`}
      description="Your lessons, homework, and progress will land here."
    />
  );
}
