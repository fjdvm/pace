import { CommentSection } from "./comment-section";
import type { AssignmentCommentsData } from "./types";

export function ClassComments({ data }: { data: AssignmentCommentsData }) {
  return (
    <CommentSection
      title="Class comments"
      addLabel="Add a class comment"
      postId={data.postId}
      visibility="class"
      currentUserId={data.currentUserId}
      instructor={{ id: data.instructorId, email: "", name: data.instructorName }}
      initialComments={data.classComments}
      className="border-t border-pace-line pt-4"
    />
  );
}

export function PrivateComments({ data }: { data: AssignmentCommentsData }) {
  return (
    <CommentSection
      title="Private comments"
      addLabel={`Add comment to ${data.instructorName}`}
      postId={data.postId}
      visibility="private"
      currentUserId={data.currentUserId}
      instructor={{ id: data.instructorId, email: "", name: data.instructorName }}
      initialComments={data.privateThread}
      className="rounded-lg border border-pace-line bg-white p-4"
    />
  );
}
