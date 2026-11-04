"use client";

import Link from "next/link";
import Image from "next/image";
import { Megaphone } from "lucide-react";
import { resolveAuthorDisplay } from "@/components/features/classes/comment-utils";
import type { RosterInstructor, RosterStudent, StreamPostData } from "@/components/features/classes/types";
import { assignmentTitle, professorLabel } from "./assignment-title";
import { postHref } from "./post-href";
import { RowMenu } from "./row-menu";

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

type AnnouncementRowProps = {
  classId: string;
  post: StreamPostData;
  isInstructor: boolean;
  currentUserId: string;
  roster: RosterStudent[];
  instructor: RosterInstructor;
  onDelete: (postId: string) => void;
};

export function AnnouncementRow({ classId, post, isInstructor, currentUserId, roster, instructor, onDelete }: AnnouncementRowProps) {
  const isAssignment = post.type === "assignment_created";
  const author = resolveAuthorDisplay(post.authorId, currentUserId, instructor, roster);
  const canDelete = isInstructor && post.authorId === currentUserId;
  const href = postHref(post, classId, isInstructor);
  const title = assignmentTitle(post.body);
  const mobileText = isAssignment ? `New assignment: ${title}` : post.body;
  const text = isAssignment ? `${professorLabel(author.name)} posted a new assignment: ${title}` : post.body;
  const count = post.classComments.length;

  return (
    <article className="relative flex items-center gap-4 rounded-lg border border-pace-line bg-white py-4 pl-5 pr-2 hover:bg-pace-canvas">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pace-green">
        {isAssignment ? <Image src="/class/assignment.svg" alt="" width={24} height={24} /> : <Megaphone className="size-5 text-white" />}
      </span>
      <Link
        href={href}
        className="flex min-w-0 flex-1 flex-col gap-0.5 text-left after:absolute after:inset-0 after:content-['']"
      >
        {!isAssignment && <span className="text-[13px] font-bold leading-normal text-pace-ink">{author.name}</span>}
        <span className="whitespace-pre-wrap break-words text-[15px] leading-[1.55] text-pace-ink">
          <span className="md:hidden">{mobileText}</span>
          <span className="hidden md:inline">{text}</span>
        </span>
        <span className="text-[13px] leading-normal text-pace-muted">
          {shortDate.format(new Date(post.createdAt))}
          {count > 0 && ` · ${count} ${count === 1 ? "comment" : "comments"}`}
        </span>
      </Link>
      <div className="relative z-10">
        <RowMenu href={href} onDelete={canDelete ? () => onDelete(post.id) : undefined} />
      </div>
    </article>
  );
}
