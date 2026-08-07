import { currentUser } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/DashboardShell";

export default async function ParentDashboardPage() {
  const user = await currentUser();

  return (
    <DashboardShell
      brandLabel="BrightPath"
      greeting={`Welcome, ${user?.firstName ?? "there"}`}
      description="Your child's assigned tutor, upcoming lessons, and progress will land here."
    >
      <a href="/parent/students" className="text-sm font-medium" style={{ color: "var(--accent)" }}>
        Manage my students →
      </a>
    </DashboardShell>
  );
}
