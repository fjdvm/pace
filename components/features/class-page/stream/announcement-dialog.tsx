"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { createPost } from "@/app/actions/posts";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type AnnouncementDialogProps = {
  classId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AnnouncementDialog({ classId, open, onOpenChange }: AnnouncementDialogProps) {
  const [body, setBody] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showLink, setShowLink] = useState(false);
  const [posting, setPosting] = useState(false);

  const close = (next: boolean) => {
    if (posting) return;
    if (!next) {
      setBody("");
      setLinkUrl("");
      setShowLink(false);
    }
    onOpenChange(next);
  };

  const submit = async () => {
    if (!body.trim()) return;
    setPosting(true);
    try {
      const result = await createPost(classId, body, linkUrl.trim() || undefined);
      if (!result.success) {
        toast.error(result.error || "Failed to post announcement");
        return;
      }
      toast.success("Announcement posted");
      setPosting(false);
      close(false);
    } finally {
      setPosting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent showCloseButton={false} className="gap-0 rounded-lg p-0 sm:max-w-[932px]">
        <DialogTitle className="border-b border-pace-line-strong px-6 py-5 text-[22px] font-normal leading-tight text-pace-ink">Post</DialogTitle>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-2 border-b-2 border-b-[#1a73e8] bg-[#f6f8fa] px-4 pb-4 pt-3">
            <label htmlFor="announcement-body" className="text-xs text-[#1a73e8]">
              Announce something to your class
            </label>
            <Textarea
              id="announcement-body"
              autoFocus
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={posting}
              rows={5}
              className="resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
          </div>
          {showLink && (
            <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} disabled={posting} placeholder="Link (https://...)" />
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Add link"
              onClick={() => setShowLink((value) => !value)}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-pace-ink-2 text-pace-ink hover:bg-pace-sunken"
            >
              <Link2 className="size-5" />
            </button>
            <div className="flex-1" />
            <button type="button" onClick={() => close(false)} className="cursor-pointer px-4 py-2 text-sm font-bold text-[#1a73e8]">
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={posting || !body.trim()}
              className={cn(
                "h-10 cursor-pointer rounded-full px-6 text-sm font-bold disabled:cursor-not-allowed",
                body.trim() ? "bg-pace-green text-white" : "bg-pace-sunken text-pace-muted",
              )}
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
