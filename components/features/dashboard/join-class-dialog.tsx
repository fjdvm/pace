"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useJoinClass } from "@/components/features/student/home/use-join-class";

type JoinClassDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function JoinClassDialog({ open, onOpenChange }: JoinClassDialogProps) {
  const join = useJoinClass();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[20px] bg-white text-pace-ink">
        <DialogHeader>
          <DialogTitle>Join class</DialogTitle>
          <DialogDescription>Enter the 6-character code your Instructor shared.</DialogDescription>
        </DialogHeader>
        <form
          className="flex gap-3"
          onSubmit={async (event) => {
            if (await join.submit(event)) onOpenChange(false);
          }}
        >
          <Input
            aria-label="Class join code"
            placeholder="e.g. KEBQ3D"
            maxLength={6}
            value={join.code}
            onChange={(event) => join.setCode(event.target.value)}
            disabled={join.isJoining}
            autoFocus
          />
          <Button type="submit" disabled={join.isJoining || !join.code.trim()}>
            {join.isJoining ? "Joining…" : "Join class"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
