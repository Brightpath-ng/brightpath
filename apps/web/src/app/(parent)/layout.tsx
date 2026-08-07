import { LayoutDashboard, Users, CalendarDays, Receipt } from "lucide-react";
import { requireRole } from "@/lib/require-role";
import { AppShell, type AppNavItem, type AppPlannedItem } from "@/components/AppShell";

const NAV_ITEMS: AppNavItem[] = [
  { label: "Dashboard", href: "/parent", icon: LayoutDashboard },
  { label: "My Students", href: "/parent/students", icon: Users },
];

const PLANNED_ITEMS: AppPlannedItem[] = [
  { label: "Lessons", icon: CalendarDays },
  { label: "Billing", icon: Receipt },
];

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  await requireRole("parent");
  return (
    <AppShell
      brandLabel="BrightPath"
      accountRoleLabel="Parent"
      navItems={NAV_ITEMS}
      plannedItems={PLANNED_ITEMS}
    >
      {children}
    </AppShell>
  );
}
