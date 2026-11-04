"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createPost } from "@/app/actions/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AnnouncementComposer({ classId }: { classId: string }) {
  const [body, setBody] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [posting, setPosting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!body.trim()) return;
    setPosting(true);
    try {
      const result = await createPost(classId, body, linkUrl || undefined);
      if (result.success) {
        setBody("");
        setLinkUrl("");
        toast.success("Announcement posted");
      } else {
        toast.error(result.error || "Failed to post announcement");
      }
    } finally {
      setPosting(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-lg border border-pace-line bg-white p-4">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={posting}
        rows={3}
        placeholder="Share an announcement with your class"
        className="resize-none"
      />
      <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} disabled={posting} placeholder="Optional link (https://...)" />
      <Button type="submit" disabled={posting || !body.trim()} className="self-end rounded-full">
        {posting ? "Posting..." : "Post"}
      </Button>
    </form>
  );
}
