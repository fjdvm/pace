"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveImportedPost } from "@/app/actions/ai-import/save-imported-post";
import type { ReviewDraft } from "./use-review-draft";

export function useSaveImport(classId: string, draft: ReviewDraft) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const save = async (assign: boolean) => {
    if (busy) return;
    setBusy(true);
    const result = await saveImportedPost({ classId, title: draft.title, instructions: draft.instructions, assign, items: draft.items })
      .catch(() => ({ success: false as const, error: "Could not save. Try again." }));
    if (!result.success) {
      setBusy(false);
      return toast.error(result.error);
    }
    toast.success(assign ? "Assigned to your Class" : "Draft saved");
    router.push(assign ? `/dashboard/classes/${classId}?tab=classwork` : `/dashboard/assignments/${result.id}/edit`);
  };
  return { busy, save };
}
