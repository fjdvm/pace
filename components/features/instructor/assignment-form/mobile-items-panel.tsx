import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { InstructorClassSummary } from "@/components/features/instructor/types";
import type { useAssignmentForm } from "./use-assignment-form";
import { AnswerItems } from "./answer-items";
import { PostSettings } from "./post-settings";
import { PrimaryCodingEditor } from "./primary-coding-editor";

type Props = { form: ReturnType<typeof useAssignmentForm>; classes: InstructorClassSummary[]; locked: boolean };
export function MobileItemsPanel({ form, classes, locked }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" disabled={!form.id} onClick={() => setOpen(true)}>Manage items</Button>
      <Dialog open={open} onOpenChange={(next) => { if (!next) form.setItemEditing(false); setOpen(next); }}>
        <DialogContent className="max-h-[90svh] max-w-[calc(100%-24px)] overflow-y-auto p-0">
          <DialogHeader className="px-4 pt-4"><DialogTitle>Post Items</DialogTitle></DialogHeader>
          <AnswerItems form={form} locked={locked} codingEditor={<PrimaryCodingEditor form={form} locked={locked} />}
            settings={(total) => <PostSettings totalPoints={total} values={form.values} classes={classes} locked={locked} onChange={form.patch} />} />
        </DialogContent>
      </Dialog>
    </>
  );
}
