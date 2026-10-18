import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { PaceButton } from "@/components/features/student/shared/pace-button";
import { SimilarityBanner } from "./similarity-banner";
import { DetailStatCards } from "./detail-stat-cards";
import { CodePanel } from "./code-panel";
import { ReviewTabsPanel } from "./review-tabs-panel";
import type { SubmissionDetail } from "./types";

const FILE_NAMES: Record<string, string> = { Python: "main.py", C: "main.c", JavaScript: "main.js", "C#": "Program.cs" };
const submittedAt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export function SubmissionDetailView({ detail }: { detail: SubmissionDetail }) {
  const base = `/dashboard/instructor/submissions/${detail.assignment.id}`;
  const { previousId, nextId } = detail.neighbors;

  return (
    <>
      <StudentTopBar
        title={detail.student.name}
        subtitle={
          detail.submittedAt
            ? `${detail.assignment.title} · Submitted ${submittedAt.format(new Date(detail.submittedAt))}`
            : detail.assignment.title
        }
        backHref={base}
        actions={
          <div className="flex items-center gap-3">
            {previousId && (
              <Link href={`${base}/${previousId}`} className="px-2 text-[13px] font-semibold text-pace-ink">
                Previous
              </Link>
            )}
            {nextId && (
              <PaceButton href={`${base}/${nextId}`} variant="secondary">
                Next student
              </PaceButton>
            )}
          </div>
        }
      />
      <main className="flex flex-1 flex-col gap-5 p-4 md:px-8 md:py-6">
        {detail.code === null ? (
          <div className="flex flex-col items-center gap-2 rounded-[20px] border-[1.5px] border-pace-line bg-white p-12 text-center">
            <AlertCircle className="size-8 text-pace-muted" />
            <h2 className="text-lg font-bold text-pace-ink">No submission yet</h2>
            <p className="text-sm text-pace-ink-2">This student has not submitted this assignment.</p>
          </div>
        ) : (
          <>
            {detail.similar && (
              <SimilarityBanner assignmentId={detail.assignment.id} studentId={detail.student.id} similar={detail.similar} />
            )}
            <DetailStatCards detail={detail} />
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <CodePanel
                filename={FILE_NAMES[detail.assignment.language] ?? "main"}
                caption="final submission"
                code={detail.code}
              />
              <ReviewTabsPanel detail={detail} />
            </div>
          </>
        )}
      </main>
    </>
  );
}
