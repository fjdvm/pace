import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { Skeleton } from "@/components/ui/skeleton";
import { flagLabel } from "@/lib/insights/item-risk";
import { NOT_PROOF_NOTE } from "@/lib/insights/next-steps";
import type { InsightsResult } from "@/app/actions/insights/get-insights";
import { InsightsLog } from "./insights-log";
import { NextStepCard } from "./next-step-card";

type Ok = Extract<InsightsResult, { success: true }>;

export function InsightsBody({
  result,
  name,
  postId,
  studentId,
  sent,
  onSend,
  onSaveDraft,
}: {
  result: InsightsResult | null;
  name: string;
  postId: string;
  studentId: string;
  sent: boolean;
  onSend: (body: string) => void;
  onSaveDraft: () => void;
}) {
  if (!result) return <Skeleton className="h-64 w-full rounded-[10px]" />;
  if (!result.success) return <p role="alert" className="text-[13px] text-pace-red">{result.error}</p>;
  const first = name.split(" ")[0];
  const steps = (result as Ok).steps;
  const tone = result.flag === "High" ? "red" : result.flag === "Medium" ? "amber" : "neutral";
  const bannerBg = result.flag === "High" ? "bg-pace-red-tint" : result.flag === "Medium" ? "bg-pace-amber-tint" : "bg-pace-sunken";
  const compare = result.similarStudentId
    ? `/dashboard/submissions/${postId}/compare?a=${studentId}&b=${result.similarStudentId}`
    : `/dashboard/submissions/${postId}`;
  return (
    <>
      <div className={`flex items-center gap-2.5 rounded-[10px] p-3 max-md:p-0 max-md:bg-transparent ${bannerBg}`}>
        <span className="max-md:hidden"><PaceTag tone={tone} className={bannerBg}>{flagLabel(result.flag)} activity</PaceTag></span>
        <p className="text-[13px] max-md:text-pace-ink-2">{steps?.summary ?? "The AI summary is unavailable right now."}</p>
      </div>
      <h3 className="hidden text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted md:block">What the log shows</h3>
      <InsightsLog result={result} />
      <h3 className="text-[11px] font-bold uppercase tracking-[0.66px] text-pace-purple">Recommended next steps</h3>
      {result.stepsError && <p role="alert" className="text-[13px] text-pace-red">{result.stepsError}</p>}
      {steps && (
        <>
          <NextStepCard
            number={1}
            title={`Ask ${first} to explain their code`}
            body={steps.explanation}
            quote={steps.suggestedComment}
            actionLabel={sent ? "Comment sent" : "Send suggested comment"}
            mobileLabel={sent ? "Comment sent" : "Send suggested comment"}
            disabled={sent}
            onAction={() => onSend(steps.suggestedComment)}
          />
          <NextStepCard
            number={2}
            title="Check similar work"
            body={steps.similarNote}
            actionLabel="Open similarity check"
            mobileLabel="Open similarity"
            href={compare}
          />
          <NextStepCard
            number={3}
            title="Keep the grade as a draft"
            body={steps.draftNote}
            actionLabel="Save grade as draft"
            mobileLabel="Save as draft"
            onAction={onSaveDraft}
          />
        </>
      )}
      <p className={`rounded-[10px] bg-pace-canvas p-3 text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted`}>
        <span className="md:hidden">Suggestions only. A flag is not proof of copying; you make the final call.</span>
        <span className="hidden md:inline">{NOT_PROOF_NOTE}</span>
      </p>
    </>
  );
}
