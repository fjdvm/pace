"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createMaterial } from "@/app/actions/materials";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MaterialDialog({ classId, open, onOpenChange }: {
  classId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");
  const [posting, setPosting] = useState(false);
  const close = (next: boolean) => {
    if (posting) return;
    if (!next) { setTitle(""); setNotes(""); setLink(""); }
    onOpenChange(next);
  };
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent showCloseButton={false} className="gap-0 rounded-lg p-0 sm:max-w-[932px]">
        <DialogTitle className="border-b border-pace-line-strong px-6 py-5 text-[22px] font-normal leading-tight text-pace-ink">Material</DialogTitle>
        <form className="flex flex-col gap-6 p-6" onSubmit={async (event) => {
          event.preventDefault();
          if (posting) return;
          setPosting(true);
          try {
            const result = await createMaterial(classId, title, notes, link);
            if (!result.success) { toast.error(result.error); return; }
            setTitle(""); setNotes(""); setLink("");
            onOpenChange(false);
            toast.success("Material shared");
            router.push(`/dashboard/classes/${classId}/posts/${result.postId}`);
          } catch {
            toast.error("Failed to share Material. Please try again.");
          } finally { setPosting(false); }
        }}>
          <div className="flex flex-col gap-2">
            <label htmlFor="material-title" className="text-xs text-pace-ink-2">Title</label>
            <Input id="material-title" autoFocus required value={title} onChange={(e) => setTitle(e.target.value)} disabled={posting} />
          </div>
          <div className="flex flex-col gap-2 border-b-2 border-b-[#1a73e8] bg-[#f6f8fa] px-4 pb-4 pt-3">
            <label htmlFor="material-notes" className="text-xs text-[#1a73e8]">Notes</label>
            <Textarea id="material-notes" value={notes} onChange={(e) => setNotes(e.target.value)} disabled={posting} rows={5} className="resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="material-link" className="text-xs text-pace-ink-2">Link (https://...)</label>
            <Input id="material-link" type="url" value={link} onChange={(e) => setLink(e.target.value)} disabled={posting} />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => close(false)} disabled={posting}>Cancel</Button>
            <Button type="submit" disabled={posting || !title.trim() || (!notes.trim() && !link.trim())} className="rounded-full bg-pace-green px-6 text-white">{posting ? "Sharing..." : "Share"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
