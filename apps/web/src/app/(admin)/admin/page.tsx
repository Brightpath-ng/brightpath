import { currentUser } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/PageHeader";

export default async function AdminDashboardPage() {
  const user = await currentUser();

  return (
    <>
      <PageHeader
        title={`Welcome, ${user?.firstName ?? "Admin"}`}
        description="Your dashboard."
      />
      <div className="p-8">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Tutor approvals, the ledger, and disputes will land here.
        </p>
      </div>
    </>
  );
}
