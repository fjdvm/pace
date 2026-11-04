"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { deletePost } from "@/app/actions/posts";
import { useClassStreamRealtime } from "@/components/features/classes/use-class-stream-realtime";
import type { RosterInstructor, RosterStudent, StreamPostData } from "@/components/features/classes/types";
import { AnnouncementComposer } from "./announcement-composer";
import { AnnouncementRow } from "./announcement-row";

type StreamPanelProps = {
  classId: string;
  initialPosts: StreamPostData[];
  isInstructor: boolean;
  canPost: boolean;
  currentUserId: string;
  roster: RosterStudent[];
  instructor: RosterInstructor;
};

export function StreamPanel({ classId, initialPosts, isInstructor, canPost, currentUserId, roster, instructor }: StreamPanelProps) {
  const [posts, setPosts] = useState(initialPosts);

  const inserted = useCallback((post: StreamPostData) => {
    setPosts((prev) => (prev.some((p) => p.id === post.id) ? prev : [post, ...prev]));
  }, []);
  const removed = useCallback((id: string) => setPosts((prev) => prev.filter((p) => p.id !== id)), []);
  useClassStreamRealtime(classId, inserted, removed);

  const handleDelete = async (id: string) => {
    const result = await deletePost(id);
    if (result.success) {
      removed(id);
      toast.success("Post deleted");
    } else {
      toast.error(result.error || "Failed to delete post");
    }
  };

  const sorted = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      {canPost && <AnnouncementComposer classId={classId} />}
      {sorted.map((post) => (
        <AnnouncementRow
          key={post.id}
          post={post}
          isInstructor={isInstructor}
          currentUserId={currentUserId}
          roster={roster}
          instructor={instructor}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
