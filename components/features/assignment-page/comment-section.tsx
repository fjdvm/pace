"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createComment, deleteComment } from "@/app/actions/comments";
import { CommentFeed } from "@/components/features/classes/comment-feed";
import type { CommentData } from "@/components/features/classes/types";

type CommentSectionProps = {
  title: string;
  addLabel: string;
  postId: string;
  visibility: "class" | "private";
  currentUserId: string;
  instructor: { id: string; email: string; name: string | null };
  initialComments: CommentData[];
  className?: string;
  headingClassName?: string;
  feedback?: React.ReactNode;
};

export function CommentSection({
  title,
  addLabel,
  postId,
  visibility,
  currentUserId,
  instructor,
  initialComments,
  className,
  feedback,
  headingClassName = "text-[15px] leading-[1.55] text-pace-ink-2",
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [open, setOpen] = useState(initialComments.length > 0);

  const handleSubmit = async (body: string) => {
    const result = await createComment(postId, body, visibility);
    if (!result.success || !result.comment) {
      toast.error(result.error || "Failed to post comment");
      return;
    }
    const { id, authorId, body: text, createdAt } = result.comment;
    setComments((prev) => [...prev, { id, authorId, body: text, createdAt: createdAt.toISOString() }]);
  };

  const handleDelete = async (commentId: string) => {
    const result = await deleteComment(commentId);
    if (!result.success) {
      toast.error(result.error || "Failed to delete comment");
      return;
    }
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <section className={className}>
      <h2 className={`font-bold ${headingClassName}`}>{title}</h2>
      {feedback}
      {open ? (
        <div className="mt-2">
          <CommentFeed
            comments={comments}
            currentUserId={currentUserId}
            isInstructor={false}
            instructor={instructor}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-2 cursor-pointer text-[13px] font-bold text-pace-green-deep"
        >
          {addLabel}
        </button>
      )}
    </section>
  );
}
