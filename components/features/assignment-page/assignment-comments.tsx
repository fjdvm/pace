import { professorLabel } from "@/components/features/class-page/stream/assignment-title";
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
      instructor={{
        id: data.instructorId,
        email: "",
        name: data.instructorName,
      }}
      initialComments={data.classComments}
      className="border-t border-pace-line pt-4"
    />
  );
}

export function PrivateComments({
  data,
  feedback,
}: {
  data: AssignmentCommentsData;
  feedback?: string | null;
}) {
  return (
    <CommentSection
      feedback={
        feedback ? (
          <div className="mt-3 flex gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pace-green-deep text-[11px] font-bold text-white">
              {data.instructorName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted">
                {data.instructorName}
              </p>
              <p className="whitespace-pre-wrap text-[13px] text-pace-ink">
                {feedback}
              </p>
            </div>
          </div>
        ) : null
      }
      title="Private comments"
      addLabel={`Add comment to ${professorLabel(data.instructorName)}`}
      postId={data.postId}
      visibility="private"
      currentUserId={data.currentUserId}
      instructor={{
        id: data.instructorId,
        email: "",
        name: data.instructorName,
      }}
      initialComments={data.privateThread}
      className="rounded-[8px] border border-pace-line bg-white p-4"
      headingClassName="text-base leading-[1.35] tracking-[-0.08px] text-pace-ink"
    />
  );
}
