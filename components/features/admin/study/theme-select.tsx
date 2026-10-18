"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { codeStudyComment } from "@/app/actions/code-study-comment";
import { THEMES } from "@/lib/study/questionnaire";

type ThemeSelectProps = {
  commentKey: string;
  themeId: string;
};

export function ThemeSelect({ commentKey, themeId }: ThemeSelectProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const change = async (next: string) => {
    const [responseId, promptId] = commentKey.split(":");
    setBusy(true);
    const result = await codeStudyComment(responseId, promptId, next);
    setBusy(false);
    if (!result.success) {
      toast.error(result.error || "Could not save the theme");
      return;
    }
    router.refresh();
  };

  return (
    <select
      aria-label="Theme"
      value={themeId}
      disabled={busy}
      onChange={(e) => change(e.target.value)}
      className="cursor-pointer rounded-full border-[1.5px] border-pace-line-strong bg-white px-3 py-1 text-xs font-semibold text-pace-ink disabled:opacity-50"
    >
      {THEMES.map((theme) => (
        <option key={theme.id} value={theme.id}>
          {theme.label}
        </option>
      ))}
    </select>
  );
}
