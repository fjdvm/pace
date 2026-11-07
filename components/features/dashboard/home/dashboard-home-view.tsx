import type { TeachingHomeClass } from "@/app/actions/teaching-home";
import type { DashboardClasses } from "@/lib/dashboard-classes";
import { ClassSwitcher } from "./class-switcher";
import { WelcomeState } from "./welcome-state";

export function DashboardHomeView({ teaching, enrolled, teachingHome, savedView }: DashboardClasses & { teachingHome: TeachingHomeClass[]; savedView?: string }) {
  const activeTeaching = teaching.filter((cls) => !cls.archived);
  const activeEnrolled = enrolled.filter((cls) => !cls.archived);
  if (activeTeaching.length === 0 && activeEnrolled.length === 0) return <WelcomeState />;

  return (
    <main className="flex min-h-full flex-col gap-3 bg-white p-4 sm:gap-4 sm:p-6">
      <ClassSwitcher teaching={teachingHome} enrolled={activeEnrolled} savedView={savedView} />
    </main>
  );
}
