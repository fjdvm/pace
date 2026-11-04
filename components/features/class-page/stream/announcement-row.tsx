"use client";

import { useState } from "react";
import Image from "next/image";
import { Megaphone } from "lucide-react";
import { CommentThread } from "@/components/features/classes/comment-thread";
import { resolveAuthorDisplay } from "@/components/features/classes/comment-utils";
import type { RosterInstructor, RosterStudent, StreamPostData } from "@/components/features/classes/types";
import { RowMenu } from "./row-menu";

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

type AnnouncementRowProps = {
  post: StreamPostData;
  isInstructor: boolean;
  currentUserId: string;
  roster: RosterStudent[];
  instructor: RosterInstructor;
  onDelete: (postId: string) => void;
};

export function AnnouncementRow({ post, isInstructor, currentUserId, roster, instructor, onDelete }: AnnouncementRowProps) {
  const [open, setOpen] = useState(false);
  const isAssignment = post.type === "assignment_created";
  const author = resolveAuthorDisplay(post.authorId, currentUserId, instructor, roster);
  const canDelete = isInstructor && post.authorId === currentUserId;
  const count = post.classComments.length;

  return (
    <article className="flex flex-col rounded-lg border border-pace-line bg-white">
      <div className="flex items-center gap-4 py-4 pl-5 pr-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pace-green">
          {isAssignment ? <Image src="/class/assignment.svg" alt="" width={24} height={24} /> : <Megaphone className="size-5 text-white" />}
        </span>
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 flex-1 cursor-pointer flex-col gap-0.5 text-left">
          {!isAssignment && <span className="text-[13px] font-bold leading-normal text-pace-ink">{author.name}</span>}
          <span className="whitespace-pre-wrap break-words text-[15px] leading-[1.55] text-pace-ink">{post.body}</span>
          <span className="text-[13px] leading-normal text-pace-muted">
            {shortDate.format(new Date(post.createdAt))}
            {count > 0 && ` · ${count} ${count === 1 ? "comment" : "comments"}`}
          </span>
        </button>
        {canDelete && <RowMenu onDelete={() => onDelete(post.id)} />}
      </div>
      {open && (
        <div className="border-t border-pace-line p-4">
          <CommentThread post={post} isInstructor={isInstructor} currentUserId={currentUserId} roster={roster} instructor={instructor} />
        </div>
      )}
    </article>
  );
}
