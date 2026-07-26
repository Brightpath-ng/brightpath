import { requireRole } from "@/lib/require-role";

export default async function TutorLayout({ children }: { children: React.ReactNode }) {
  await requireRole("tutor");
  return children;
}
