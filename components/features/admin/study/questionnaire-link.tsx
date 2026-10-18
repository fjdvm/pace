"use client";

import { toast } from "sonner";
import { PaceActionButton } from "@/components/features/student/shared/pace-action-button";

export function QuestionnaireLink({ path }: { path: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      toast.success("Questionnaire link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };
  return (
    <PaceActionButton variant="secondary" onClick={copy}>
      Copy questionnaire link
    </PaceActionButton>
  );
}
