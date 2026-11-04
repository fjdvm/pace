import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import type { DashboardClasses } from "@/lib/dashboard-classes";
import { ClassList } from "./class-list";

export function DashboardHomeView({ teaching, enrolled }: DashboardClasses) {
  const activeTeaching = teaching.filter((cls) => !cls.archived);
  const activeEnrolled = enrolled.filter((cls) => !cls.archived);
  const empty = activeTeaching.length === 0 && activeEnrolled.length === 0;

  return (
    <>
      <StudentTopBar title="Home" />
      <main className="grid gap-8 p-4 md:p-10">
        {empty ? (
          <section className="flex flex-col items-center gap-4 rounded-[20px] border border-pace-line bg-white px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-pace-ink">Welcome to PACE</h2>
            <p className="max-w-md text-pace-ink-2">Use the plus button to create a Class and start teaching, or join a Class with an Instructor&apos;s code.</p>
          </section>
        ) : <>
          <ClassList title="Teaching" classes={activeTeaching} />
          <ClassList title="Enrolled" classes={activeEnrolled} />
        </>}
      </main>
    </>
  );
}
