import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import type { AdminOverviewData } from "@/components/features/admin/types";
import { AdminStatCards } from "./admin-stat-cards";
import { SystemStatusCard } from "./system-status-card";
import { OperationalPill } from "./operational-pill";

export function AdminOverviewView({ data }: { data: AdminOverviewData }) {
  return (
    <>
      <StudentTopBar
        title="Platform overview"
        subtitle="Monitor activity and keep PACE running"
        hideBell
        actions={<OperationalPill operational={data.operational} />}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:px-10 md:py-8">
        <AdminStatCards counts={data.counts} />
        <div className="w-full xl:max-w-[360px]">
          <SystemStatusCard items={data.status} />
        </div>
      </main>
    </>
  );
}
