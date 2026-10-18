import { ShieldAlert } from "lucide-react";
import { PaceButton } from "@/components/features/student/shared/pace-button";
import type { SubmissionDetail } from "./types";

type SimilarityBannerProps = {
  assignmentId: string;
  studentId: string;
  similar: NonNullable<SubmissionDetail["similar"]>;
};

export function SimilarityBanner({ assignmentId, studentId, similar }: SimilarityBannerProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-pace-amber-tint px-5 py-3">
      <ShieldAlert className="size-4 shrink-0 text-pace-amber" />
      <p className="min-w-0 flex-1 text-[13px] text-pace-ink">
        Code structure is {Math.round(similar.similarity * 100)}% similar to {similar.name}. This is a prompt to review,
        not proof of copying.
      </p>
      <PaceButton
        href={`/dashboard/instructor/submissions/${assignmentId}/compare?a=${studentId}&b=${similar.studentId}`}
        variant="secondary"
        className="h-9"
      >
        Compare side by side
      </PaceButton>
    </div>
  );
}
