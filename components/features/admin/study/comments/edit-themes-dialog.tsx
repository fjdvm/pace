"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaceActionButton } from "@/components/features/student/shared/pace-action-button";
import { setCommentThemes } from "@/app/actions/study-themes";
import { cn } from "@/lib/utils";
import type { StudyComment } from "@/lib/study/dataset";
import type { ThemeDef } from "@/lib/study/themes";
import { ThemeDot } from "./theme-dot";

type EditThemesDialogProps = {
  comment: StudyComment | null;
  themes: ThemeDef[];
  onClose: () => void;
};

export function EditThemesDialog({ comment, themes, onClose }: EditThemesDialogProps) {
  return (
    <Dialog open={!!comment} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-5 rounded-[20px] border-[1.5px] border-pace-line bg-white p-6 text-pace-ink shadow-[0_4px_0_0_var(--color-pace-line)] ring-0 sm:max-w-md">
        {comment && <EditThemesForm key={comment.key} comment={comment} themes={themes} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function EditThemesForm({ comment, themes, onClose }: { comment: StudyComment; themes: ThemeDef[]; onClose: () => void }) {
  const router = useRouter();
  const [selected, setSelected] = useState(comment.themeIds);
  const [busy, setBusy] = useState(false);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const save = async () => {
    const [responseId, promptId] = comment.key.split(":");
    setBusy(true);
    const result = await setCommentThemes(responseId, promptId, selected);
    setBusy(false);
    if (!result.success) {
      toast.error(result.error || "Could not save the themes");
      return;
    }
    toast.success("Themes saved");
    router.refresh();
    onClose();
  };

  return (
    <>
      <DialogHeader className="gap-2">
        <DialogTitle className="text-xl font-bold leading-tight">Edit themes</DialogTitle>
        <DialogDescription className="text-sm leading-relaxed text-pace-ink-2">
          &ldquo;{comment.text}&rdquo;
        </DialogDescription>
      </DialogHeader>
      <ul className="flex max-h-72 flex-col gap-1.5 overflow-y-auto">
        {themes.map((theme) => {
          const checked = selected.includes(theme.id);
          return (
            <li key={theme.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggle(theme.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-3.5 py-2.5 text-left text-[13px]",
                  checked ? "border-pace-green bg-pace-green-tint" : "border-pace-line bg-white",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border-[1.5px]",
                    checked ? "border-pace-green bg-pace-green text-white" : "border-pace-line-strong",
                  )}
                >
                  {checked && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <ThemeDot tone={theme.tone} />
                {theme.label}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-end gap-3">
        <PaceActionButton variant="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </PaceActionButton>
        <PaceActionButton onClick={save} disabled={busy}>
          {busy ? "Saving..." : "Save themes"}
        </PaceActionButton>
      </div>
    </>
  );
}
