import type { DashboardClasses } from "@/lib/dashboard-classes";
import { ClassSwitcher } from "./class-switcher";
import { WelcomeState } from "./welcome-state";

export function DashboardHomeView({ teaching, enrolled, savedView }: DashboardClasses & { savedView?: string }) {
  const activeTeaching = teaching.filter((cls) => !cls.archived);
  const activeEnrolled = enrolled.filter((cls) => !cls.archived);
  if (activeTeaching.length === 0 && activeEnrolled.length === 0) return <WelcomeState />;

  return (
    <main className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-6">
      <ClassSwitcher teaching={activeTeaching} enrolled={activeEnrolled} savedView={savedView} />
    </main>
  );
}
