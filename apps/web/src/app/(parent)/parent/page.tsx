import { currentUser } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/PageHeader";

export default async function ParentDashboardPage() {
  const user = await currentUser();

  return (
    <>
      <PageHeader title={`Welcome, ${user?.firstName ?? "there"}`} description="Your dashboard." />
      <div className="p-8">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Your child&rsquo;s assigned tutor, upcoming lessons, and progress will land here.
        </p>
      </div>
    </>
  );
}
