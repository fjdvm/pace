import { ShieldCheck } from "lucide-react";
import { PaceButton } from "@/components/features/student/shared/pace-button";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import type { SimilarityPairView } from "./types";

type SimilarityCardProps = {
  assignmentId: string;
  pairs: SimilarityPairView[];
};

export function SimilarityCard({ assignmentId, pairs }: SimilarityCardProps) {
  return (
    <section className="flex flex-col gap-3 rounded-[20px] border-[1.5px] border-pace-line bg-white p-5 shadow-[0_3px_0_0_var(--color-pace-line)]">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[15px] font-bold text-pace-ink">
          <ShieldCheck className="size-4" />
          Similarity check
        </h2>
        <PaceTag tone="amber" className="px-2.5 py-0.5 text-[11px]">
          {pairs.length} {pairs.length === 1 ? "pair" : "pairs"}
        </PaceTag>
      </div>
      {pairs.length === 0 ? (
        <p className="rounded-xl bg-pace-green-tint px-3.5 py-3 text-xs text-pace-green-deep">
          No submissions look similar so far.
        </p>
      ) : (
        pairs.slice(0, 5).map((pair) => (
          <div key={`${pair.aId}-${pair.bId}`} className="flex items-center gap-3 rounded-xl bg-pace-amber-tint px-3.5 py-2.5">
            <span className="min-w-0 flex-1 truncate text-xs font-semibold text-pace-ink">
              {pair.aName} ↔ {pair.bName}{" "}
              <span className="ml-1 font-bold">{Math.round(pair.similarity * 100)}%</span>
            </span>
            <PaceButton
              href={`/dashboard/instructor/submissions/${assignmentId}/compare?a=${pair.aId}&b=${pair.bId}`}
              variant="secondary"
              className="h-8 px-3.5 text-xs"
            >
              Compare
            </PaceButton>
          </div>
        ))
      )}
      <p className="text-xs leading-relaxed text-pace-muted">
        A flag means the code structure is similar. Short programs often look alike, so review before drawing
        conclusions.
      </p>
    </section>
  );
}
