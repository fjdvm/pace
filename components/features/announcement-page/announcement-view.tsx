import Link from "next/link";
import { ArrowLeft, Megaphone } from "lucide-react";
import { CommentThread } from "@/components/features/classes/comment-thread";
import { resolveAuthorDisplay } from "@/components/features/classes/comment-utils";
import type { StreamPostData } from "@/components/features/classes/types";
import type { ClassPageData } from "@/components/features/class-page/types";

const longDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export function AnnouncementView({ data, post }: { data: ClassPageData; post: StreamPostData }) {
  const isInstructor = data.role === "instructor";
  const author = resolveAuthorDisplay(post.authorId, data.currentUserId, data.instructor, data.roster);

  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col gap-4 p-4 md:py-6">
      <Link href={`/dashboard/classes/${data.classId}`} className="flex items-center gap-2 text-[13px] font-semibold text-pace-ink-2">
        <ArrowLeft className="size-4" /> {data.className}
      </Link>
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pace-green">
          <Megaphone className="size-5 text-white" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-[13px] text-pace-muted">
            {author.name} · {longDate.format(new Date(post.createdAt))}
          </p>
          <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.55] text-pace-ink">{post.body}</p>
          {post.linkUrl && (
            <a href={post.linkUrl} target="_blank" rel="noopener noreferrer" className="break-all text-[13px] font-semibold text-pace-green-deep underline">
              {post.linkUrl}
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-pace-line pt-4">
        <CommentThread
          post={post}
          isInstructor={isInstructor}
          currentUserId={data.currentUserId}
          roster={data.roster}
          instructor={data.instructor}
        />
      </div>
    </div>
  );
}
