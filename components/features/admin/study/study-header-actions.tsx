"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PaceActionButton } from "@/components/features/student/shared/pace-action-button";
import { paceButtonBase, paceButtonStyles } from "@/components/features/student/shared/pace-button";
import { setQuestionnaireOpen } from "@/app/actions/study-questionnaire";
import { cn } from "@/lib/utils";

export function StudyHeaderActions({ closed }: { closed: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    const result = await setQuestionnaireOpen(closed);
    setBusy(false);
    if (!result.success) {
      toast.error(result.error || "Could not update the questionnaire");
      return;
    }
    toast.success(closed ? "Questionnaire reopened" : "Questionnaire closed");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      <PaceActionButton variant="secondary" disabled={busy} onClick={toggle}>
        {closed ? "Reopen questionnaire" : "Close questionnaire"}
      </PaceActionButton>
      <a
        href="/dashboard/admin/study-results/export"
        download
        className={cn(paceButtonBase, paceButtonStyles.primary)}
      >
        Export data (.xlsx)
      </a>
    </div>
  );
}
