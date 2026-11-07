import { COMMENT_PROMPTS, type CommentPromptId } from "@/lib/study/questionnaire";
import { MAX_COMMENT_LENGTH } from "@/lib/study/normalize-state";
import type { FormState } from "@/lib/study/form-progress";
import type { CommentsSection as CommentsSectionData } from "@/lib/study/sitting-form";
import { Textarea } from "@/components/ui/textarea";
import { FadeUp } from "../shared/fade-up";
import { PartHeader } from "./part-header";

type Props = { section: CommentsSectionData; state: FormState; onChange: (id: CommentPromptId, value: string) => void };

export function CommentsSection({ section, state, onChange }: Props) {
  return (
    <>
      <FadeUp>
        <PartHeader part={section.part} title={section.title} subtitle={section.subtitle} />
      </FadeUp>
      {COMMENT_PROMPTS.map(({ id, label }, index) => (
        <FadeUp key={id} className="flex flex-col gap-3 rounded-[18px] border border-lp-line bg-white p-5">
          <label htmlFor={`comment-${id}`} className="text-base font-medium leading-6 text-lp-ink">
            {index + 1}. {label}
          </label>
          <Textarea
            id={`comment-${id}`}
            value={state.comments[id] ?? ""}
            maxLength={MAX_COMMENT_LENGTH}
            placeholder="Type your answer (optional)"
            onChange={(event) => onChange(id, event.target.value)}
            className="h-[110px] resize-none rounded-xl border-0 bg-lp-canvas p-3.5 text-sm placeholder:text-[#9a9a9a] focus-visible:ring-0"
          />
        </FadeUp>
      ))}
    </>
  );
}
