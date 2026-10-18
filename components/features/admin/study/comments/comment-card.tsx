import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { COMMENT_PROMPTS } from "@/lib/study/questionnaire";
import type { StudyComment } from "@/lib/study/dataset";
import type { ThemeDef } from "@/lib/study/themes";

type CommentCardProps = {
  comment: StudyComment;
  themes: ThemeDef[];
  onEdit: (comment: StudyComment) => void;
};

export function CommentCard({ comment, themes, onEdit }: CommentCardProps) {
  const prompt = COMMENT_PROMPTS.find((p) => p.id === comment.promptId)?.short;
  const who = comment.role === "student" ? ["Student", comment.yearLevel] : ["Instructor"];
  const assigned = comment.themeIds.map((id) => themes.find((t) => t.id === id)).filter((t): t is ThemeDef => !!t);

  return (
    <li className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-pace-line bg-white px-5 py-4">
      <p className="whitespace-pre-wrap text-sm text-pace-ink">&ldquo;{comment.text}&rdquo;</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-pace-muted">
        <span>{[...who, prompt].filter(Boolean).join(" · ")}</span>
        {assigned.map((theme) => (
          <PaceTag key={theme.id} tone={theme.tone} className="px-2.5 py-0.5 text-[11px]">
            {theme.label}
          </PaceTag>
        ))}
        <span className="flex-1" />
        <button type="button" onClick={() => onEdit(comment)} className="cursor-pointer text-[13px] font-medium text-pace-ink">
          Edit themes
        </button>
      </div>
    </li>
  );
}
