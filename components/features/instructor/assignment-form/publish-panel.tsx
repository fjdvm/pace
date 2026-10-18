import { Check, Circle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaceActionButton } from "@/components/features/student/shared/pace-action-button";
import type { buildChecklist } from "@/lib/assignment-form";

type PublishPanelProps = {
  checklist: ReturnType<typeof buildChecklist>;
  classCodes: string[];
  isEditing: boolean;
  isSaving: boolean;
  onPublish: () => void;
  onFillSample: () => void;
};

export function PublishPanel({ checklist, classCodes, isEditing, isSaving, onPublish, onFillSample }: PublishPanelProps) {
  return (
    <aside className="flex flex-col gap-3 lg:sticky lg:top-6 lg:w-72 lg:shrink-0">
      <div className="flex flex-col gap-4 rounded-[20px] border-[1.5px] border-pace-line bg-white p-5 shadow-[0_3px_0_0_var(--color-pace-line)]">
        <h2 className="text-sm font-bold text-pace-ink">{isEditing ? "Save your changes" : "Ready to publish"}</h2>
        <ul className="flex flex-col gap-2.5">
          {checklist.map((item) => (
            <li key={item.label} className={cn("flex items-center gap-2 text-xs", item.done ? "text-pace-ink" : "text-pace-muted")}>
              {item.done ? (
                <Check className="size-3.5 text-pace-green-deep" strokeWidth={2.5} />
              ) : (
                <Circle className="size-3.5" />
              )}
              {item.label}
            </li>
          ))}
        </ul>
        <PaceActionButton variant="primary" className="h-11 w-full" disabled={isSaving} onClick={onPublish}>
          {isSaving ? "Saving..." : isEditing ? "Save changes" : "Publish assignment"}
        </PaceActionButton>
        <p className="text-xs leading-relaxed text-pace-muted">
          {classCodes.length > 0
            ? `Students in ${classCodes.join(", ")} get a notification when you ${isEditing ? "save" : "publish"}.`
            : "Pick a class to notify its students."}
        </p>
      </div>
      {!isEditing && (
        <button
          type="button"
          onClick={onFillSample}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-pace-sunken px-4 py-3 text-xs text-pace-ink-2"
        >
          <Sparkles className="size-3.5" />
          Fill with a sample assignment
        </button>
      )}
    </aside>
  );
}
