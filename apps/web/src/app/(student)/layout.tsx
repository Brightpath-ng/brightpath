import { requireRole } from "@/lib/require-role";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  await requireRole("student");
  return children;
}
