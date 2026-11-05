"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { paceButtonBase, paceButtonStyles } from "@/components/features/student/shared/pace-button";
import { useIsMobile } from "@/hooks/use-mobile";
import { markSubmissionReviewed } from "@/app/actions/insights/mark-reviewed";
import { sendSuggestedComment } from "@/app/actions/insights/send-suggested-comment";
import { InsightsBody } from "./insights-body";
import { useInsights } from "./use-insights";

export function InsightsSheet({
  open,
  onOpenChange,
  postId,
  studentId,
  name,
  itemId,
  itemNumber,
  submissionId,
  reviewed,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  studentId: string;
  name: string;
  itemId: string;
  itemNumber: number;
  submissionId: string;
  reviewed: boolean;
}) {
  const mobile = useIsMobile();
  const router = useRouter();
  const result = useInsights(open, postId, studentId, itemId);
  const [sentFor, setSentFor] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const run = (work: () => Promise<void>) =>
    start(async () => {
      setError("");
      try {
        await work();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  const close = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={mobile ? "bottom" : "right"}
        showCloseButton={false}
        className="gap-3 overflow-y-auto bg-white px-5 pb-7 pt-3 max-md:rounded-t-[20px] md:w-[480px] md:px-7 md:py-6 md:data-[side=right]:sm:max-w-[480px] md:shadow-[-8px_0_32px_rgba(0,0,0,0.2)]"
      >
        <span className="mx-auto h-1 w-10 rounded-sm bg-pace-line-strong md:hidden" />
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-pace-purple-tint text-[15px] font-bold text-pace-purple max-md:hidden">✦</span>
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-[22px] font-bold leading-tight tracking-[-0.22px] md:text-base md:tracking-[-0.08px]">
              <span className="text-pace-purple md:hidden">✦ </span>
              <span className="md:hidden">Insights</span>
              <span className="hidden md:inline">Insights on this submission</span>
            </SheetTitle>
            <SheetDescription className="hidden truncate text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted md:block">
              {name} · Item {itemNumber} · from the activity log and tests
            </SheetDescription>
          </div>
          <SheetClose aria-label="Close insights" className="hidden cursor-pointer text-base font-bold text-pace-ink-2 md:block">✕</SheetClose>
        </div>
        <InsightsBody
          result={result}
          name={name}
          postId={postId}
          studentId={studentId}
          sent={sentFor === itemId}
          onSend={(body) => run(async () => { await sendSuggestedComment(postId, studentId, body); setSentFor(itemId); })}
          onSaveDraft={() => { document.getElementById("save-draft-grade")?.click(); close(); }}
        />
        {error && <p role="alert" className="text-[13px] text-pace-red">{error}</p>}
        <div className="flex gap-2.5 md:justify-end">
          <Button variant="ghost" onClick={close} className={`${paceButtonBase} ${paceButtonStyles.secondary} h-[52px] flex-1 md:h-10 md:flex-none md:border-0 md:bg-transparent md:shadow-none`}>
            Dismiss
          </Button>
          <Button
            disabled={pending || reviewed}
            onClick={() => run(async () => { await markSubmissionReviewed(postId, submissionId); router.refresh(); close(); })}
            className={`${paceButtonBase} ${paceButtonStyles.green} h-[52px] flex-1 md:h-10 md:flex-none`}
          >
            {reviewed ? "Reviewed" : <><span className="md:hidden">Mark reviewed</span><span className="hidden md:inline">Mark as reviewed</span></>}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
