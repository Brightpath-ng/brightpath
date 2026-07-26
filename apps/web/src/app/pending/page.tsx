import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PendingPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Already has a role (e.g. navigated back here after the webhook caught
  // up) -- send them to their own dashboard instead of a stale waiting page.
  const role = sessionClaims?.publicMetadata?.role;
  if (role) {
    redirect(`/${role}`);
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center"
      style={{ background: "var(--bg-base)" }}
    >
      <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
        Setting up your account
      </h1>
      <p className="max-w-sm text-sm" style={{ color: "var(--text-secondary)" }}>
        This only takes a moment. Refresh once your account is ready.
      </p>
      <a
        href="/"
        className="rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium"
        style={{ background: "var(--accent)", color: "var(--text-on-accent)" }}
      >
        Refresh
      </a>
    </div>
  );
}
