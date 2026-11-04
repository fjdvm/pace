import type { StreamPostData } from "@/components/features/classes/types";

export function postHref(post: StreamPostData, classId: string, isInstructor: boolean) {
  if (post.type === "assignment_created" && post.assignmentId) {
    return isInstructor ? `/dashboard/submissions/${post.assignmentId}` : `/dashboard/assignments/${post.assignmentId}`;
  }
  return `/dashboard/classes/${classId}/posts/${post.id}`;
}
