import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { RequestsCard } from "@/components/features/admin/approvals/requests-card";
import type { AdminOverviewData } from "@/components/features/admin/types";
import { AdminStatCards } from "./admin-stat-cards";
import { SystemStatusCard } from "./system-status-card";
import { OperationalPill } from "./operational-pill";

export function AdminOverviewView({ data }: { data: AdminOverviewData }) {
  return (
    <>
      <StudentTopBar
        title="Platform overview"
        subtitle="Approve instructors and keep PACE running"
        hideBell
        actions={<OperationalPill operational={data.operational} />}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:px-10 md:py-8">
        <AdminStatCards counts={data.counts} />
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1">
            <RequestsCard requests={data.pending} />
          </div>
          <aside className="w-full shrink-0 xl:w-[360px]">
            <SystemStatusCard items={data.status} />
          </aside>
        </div>
      </main>
    </>
  );
}
