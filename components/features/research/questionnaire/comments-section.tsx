import { COMMENT_PROMPTS, type CommentPromptId } from "@/lib/study/questionnaire";
import { MAX_COMMENT_LENGTH } from "@/lib/study/response";
import { PartCard } from "./part-card";

type CommentsSectionProps = {
  comments: Record<CommentPromptId, string>;
  onChange: (id: CommentPromptId, value: string) => void;
};

export function CommentsSection({ comments, onChange }: CommentsSectionProps) {
  return (
    <PartCard part="Part III" title="Comments and suggestions" description="Optional, but it helps us improve PACE.">
      {COMMENT_PROMPTS.map(({ id, label }) => (
        <div key={id} className="flex flex-col gap-2">
          <label htmlFor={`comment-${id}`} className="pace-body font-semibold text-pace-ink">
            {label}
          </label>
          <textarea
            id={`comment-${id}`}
            value={comments[id]}
            maxLength={MAX_COMMENT_LENGTH}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder="Type your answer"
            rows={3}
            className="pace-body w-full resize-y rounded-xl border-[1.5px] border-pace-line bg-white px-4 py-3 text-pace-ink outline-none placeholder:text-pace-muted focus:border-pace-ink"
          />
        </div>
      ))}
    </PartCard>
  );
}
