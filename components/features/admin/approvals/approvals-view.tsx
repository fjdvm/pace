import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import type { InstructorRequest } from "@/components/features/admin/types";
import { RequestsCard } from "./requests-card";
import { ReviewedCard } from "./reviewed-card";

type ApprovalsViewProps = {
  pending: InstructorRequest[];
  reviewed: InstructorRequest[];
};

export function ApprovalsView({ pending, reviewed }: ApprovalsViewProps) {
  return (
    <>
      <StudentTopBar title="Approvals" subtitle="Review instructor requests before they can create classes" hideBell />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:px-10 md:py-8">
        <RequestsCard requests={pending} />
        <ReviewedCard instructors={reviewed} />
      </main>
    </>
  );
}
