"use client";

import { useState } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { generateAssignmentReport } from "@/app/actions/assignment-report";

type AiSummaryCardProps = {
  assignmentId: string;
  initialNarrative: string | null;
  hasSubmissions: boolean;
};

export function AiSummaryCard({ assignmentId, initialNarrative, hasSubmissions }: AiSummaryCardProps) {
  const [narrative, setNarrative] = useState(initialNarrative);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setIsGenerating(true);
    setError(null);
    const result = await generateAssignmentReport(assignmentId, { forceRegenerate: !!narrative });
    if (result.success) setNarrative(result.narrative ?? null);
    else setError(result.error || "Could not generate the summary");
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-pace-purple-tint p-3.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-bold text-pace-purple">
          <Sparkles className="size-3.5" />
          AI summary
        </span>
        {narrative && (
          <button
            type="button"
            onClick={generate}
            disabled={isGenerating}
            aria-label="Regenerate summary"
            className="cursor-pointer text-pace-purple disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
          </button>
        )}
      </div>
      {narrative ? (
        <p className="text-xs leading-relaxed text-pace-ink">{narrative}</p>
      ) : (
        <>
          <p className="text-xs leading-relaxed text-pace-ink-2">
            {hasSubmissions
              ? "Get a short plain-language read on how the class did."
              : "A summary becomes available once students submit."}
          </p>
          {hasSubmissions && (
            <button
              type="button"
              onClick={generate}
              disabled={isGenerating}
              className="flex w-fit cursor-pointer items-center gap-1.5 text-xs font-semibold text-pace-purple disabled:opacity-50"
            >
              {isGenerating && <Loader2 className="size-3.5 animate-spin" />}
              {isGenerating ? "Generating..." : "Generate summary"}
            </button>
          )}
        </>
      )}
      {error && <p className="text-xs text-pace-red">{error}</p>}
    </div>
  );
}
