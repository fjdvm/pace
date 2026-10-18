"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createStudyTheme } from "@/app/actions/study-themes";
import { MAX_THEME_LENGTH } from "@/lib/study/themes";

export function NewThemeForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const result = await createStudyTheme(label);
    setBusy(false);
    if (!result.success) {
      toast.error(result.error || "Could not create the theme");
      return;
    }
    toast.success("Theme added");
    router.refresh();
    onDone();
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2 px-1">
      <input
        autoFocus
        value={label}
        maxLength={MAX_THEME_LENGTH}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Theme name"
        aria-label="Theme name"
        className="h-9 min-w-0 flex-1 rounded-lg border-[1.5px] border-pace-line bg-white px-3 text-[13px] text-pace-ink outline-none focus:border-pace-ink"
      />
      <button type="submit" disabled={busy || !label.trim()} className="cursor-pointer text-[13px] font-semibold text-pace-green-deep disabled:opacity-50">
        Add
      </button>
      <button type="button" onClick={onDone} className="cursor-pointer text-[13px] text-pace-muted">
        Cancel
      </button>
    </form>
  );
}
