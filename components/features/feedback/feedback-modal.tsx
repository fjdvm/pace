"use client";

import { useState } from "react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitFeedback } from "@/app/actions/feedback";

const fieldClass =
  "rounded-xl border-[1.5px] border-pace-line-strong bg-white px-4 text-[15px] text-pace-ink placeholder:text-pace-muted focus-visible:border-2 focus-visible:border-pace-ink focus-visible:ring-0 md:text-[15px]";
const labelClass = "text-[13px] font-semibold leading-normal text-pace-ink";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const pathname = usePathname();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await submitFeedback(title, description, pathname);
      if (result.success) {
        toast.success("Thanks! Your issue has been filed.");
        setTitle("");
        setDescription("");
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to submit feedback");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 rounded-[20px] border-[1.5px] border-pace-line bg-white p-6 text-pace-ink shadow-[0_4px_0_0_var(--color-pace-line)] ring-0 sm:max-w-md">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-2xl font-bold leading-[1.15] tracking-[-0.48px]">
            Report an issue
          </DialogTitle>
          <DialogDescription className="text-[15px] leading-[1.55] text-pace-ink-2">
            Found a bug or have a suggestion? It goes straight to our GitHub
            issues.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="feedback-title" className={labelClass}>
              Title
            </Label>
            <Input
              id="feedback-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              placeholder="Short summary of the issue"
              maxLength={150}
              required
              className={`h-12 ${fieldClass}`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="feedback-description" className={labelClass}>
              Description
            </Label>
            <Textarea
              id="feedback-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              placeholder="What happened? What did you expect instead?"
              rows={5}
              maxLength={2000}
              required
              className={`py-3 ${fieldClass}`}
            />
          </div>

          <DialogFooter className="m-0 flex-row justify-end gap-3 border-0 bg-transparent p-0">
            <Button
              type="button"
              variant="outline"
              className="h-10 cursor-pointer rounded-full border-[1.5px] border-pace-line-strong bg-white px-[18px] text-sm font-bold text-pace-ink shadow-[0_3px_0_0_var(--color-pace-line-strong)] hover:bg-pace-canvas"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 cursor-pointer rounded-full bg-pace-ink px-5 text-sm font-bold text-white hover:bg-pace-ink/85"
              disabled={isSubmitting || !title.trim() || !description.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit issue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
