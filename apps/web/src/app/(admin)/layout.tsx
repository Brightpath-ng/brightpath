import { requireRole } from "@/lib/require-role";
import { AppShell, type AppNavItem, type AppPlannedItem } from "@/components/AppShell";

const NAV_ITEMS: AppNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Tutor Applications", href: "/admin/tutors", icon: "ClipboardCheck" },
  { label: "Matching", href: "/admin/assignments", icon: "UserCheck" },
];

const PLANNED_ITEMS: AppPlannedItem[] = [
  { label: "Ledger", icon: "Wallet" },
  { label: "Disputes", icon: "ShieldAlert" },
  { label: "Users", icon: "UserCog" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("admin");
  return (
    <AppShell
      brandLabel="BrightPath Admin"
      accountRoleLabel="Admin"
      navItems={NAV_ITEMS}
      plannedItems={PLANNED_ITEMS}
    >
      {children}
    </AppShell>
  );
}
