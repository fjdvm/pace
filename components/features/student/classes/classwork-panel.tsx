import type { StreamPostData } from "@/components/features/classes/types";
import type { StudentAssignment } from "@/components/features/student/types";
import { ClassworkRow } from "./classwork-row";
import { ProgressCard } from "./progress-card";
import { AnnouncementsCard } from "./announcements-card";
import { ClassCodeCard } from "./class-code-card";

type ClassworkPanelProps = {
  assignments: StudentAssignment[];
  posts: StreamPostData[];
  joinCode: string;
  onOpenStream: () => void;
};

export function ClassworkPanel({ assignments, posts, joinCode, onOpenStream }: ClassworkPanelProps) {
  const open = assignments.filter((a) => a.status !== "submitted");
  const done = assignments.filter((a) => a.status === "submitted");

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        {assignments.length === 0 && (
          <p className="rounded-2xl border-[1.5px] border-pace-line bg-white p-8 text-center text-[13px] text-pace-ink-2">
            No assignments posted yet.
          </p>
        )}
        {[...open, ...done].map((a) => (
          <ClassworkRow key={a.id} assignment={a} />
        ))}
      </div>
      <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-80">
        <ProgressCard assignments={assignments} />
        <AnnouncementsCard posts={posts} onOpenStream={onOpenStream} />
        <ClassCodeCard code={joinCode} />
      </aside>
    </div>
  );
}
