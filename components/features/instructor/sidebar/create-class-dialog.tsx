"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaceActionButton } from "@/components/features/student/shared/pace-action-button";
import { PaceTextField } from "@/components/features/shared/pace-text-field";
import { useClassActions } from "@/components/features/dashboard/instructor/components/use-class-actions";
import { composeClassName } from "@/lib/class-name";

type CreateClassDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateClassDialog({ open, onOpenChange }: CreateClassDialogProps) {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const { isCreatingClass, handleCreateClass } = useClassActions();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!code.trim()) return;
    const created = await handleCreateClass(composeClassName(code, description));
    if (created) {
      setCode("");
      setDescription("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 rounded-[20px] border-[1.5px] border-pace-line bg-white p-6 text-pace-ink shadow-[0_4px_0_0_var(--color-pace-line)] ring-0 sm:max-w-md">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-2xl font-bold leading-[1.15] tracking-[-0.48px]">Create a class</DialogTitle>
          <DialogDescription className="text-[15px] leading-[1.55] text-pace-ink-2">
            Students join with the code we generate for you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <PaceTextField label="Course code" placeholder="CS 101" value={code} onChange={(e) => setCode(e.target.value)} autoFocus />
          <PaceTextField
            label="Course name and section"
            placeholder="Programming 1 · BSIT 1–1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <PaceActionButton variant="secondary" onClick={() => onOpenChange(false)} disabled={isCreatingClass}>
              Cancel
            </PaceActionButton>
            <PaceActionButton type="submit" disabled={isCreatingClass || !code.trim()}>
              {isCreatingClass ? "Creating..." : "Create class"}
            </PaceActionButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
