import { requireRole } from "@/lib/require-role";

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  await requireRole("parent");
  return children;
}
