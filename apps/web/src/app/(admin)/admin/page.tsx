import { currentUser } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/DashboardShell";

export default async function AdminDashboardPage() {
  const user = await currentUser();

  return (
    <DashboardShell
      brandLabel="BrightPath Admin"
      greeting={`Welcome, ${user?.firstName ?? "Admin"}`}
      description="Tutor approvals, the ledger, and disputes will land here."
    />
  );
}
