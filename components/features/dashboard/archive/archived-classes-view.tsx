import type { DashboardClasses } from "@/lib/dashboard-classes";
import { ArchivedGroup } from "./archived-group";

export function ArchivedClassesView({ teaching, enrolled }: DashboardClasses) {
  const archivedTeaching = teaching.filter((cls) => cls.archived);
  const archivedEnrolled = enrolled.filter((cls) => cls.archived);
  const empty = archivedTeaching.length === 0 && archivedEnrolled.length === 0;

  return (
    <main className="flex flex-col gap-6 p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-pace-ink">Archived classes</h1>
      {empty && <p className="text-pace-ink-2">No archived classes.</p>}
      <ArchivedGroup title="Teaching" role="instructor" classes={archivedTeaching} />
      <ArchivedGroup title="Enrolled" role="student" classes={archivedEnrolled} />
    </main>
  );
}
