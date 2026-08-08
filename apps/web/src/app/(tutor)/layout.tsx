import { requireRole } from "@/lib/require-role";
import { AppShell, type AppNavItem, type AppPlannedItem } from "@/components/AppShell";

const NAV_ITEMS: AppNavItem[] = [{ label: "Dashboard", href: "/tutor", icon: "LayoutDashboard" }];

const PLANNED_ITEMS: AppPlannedItem[] = [
  { label: "My Students", icon: "GraduationCap" },
  { label: "Lessons", icon: "CalendarDays" },
  { label: "Earnings", icon: "Wallet" },
];

export default async function TutorLayout({ children }: { children: React.ReactNode }) {
  await requireRole("tutor");
  return (
    <AppShell
      brandLabel="BrightPath Tutor"
      accountRoleLabel="Tutor"
      navItems={NAV_ITEMS}
      plannedItems={PLANNED_ITEMS}
    >
      {children}
    </AppShell>
  );
}
