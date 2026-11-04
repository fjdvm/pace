import { nextUpcoming } from "@/lib/next-upcoming";
import { getDisplayName } from "@/lib/display-name";
import type { ClassPageData } from "../types";
import { ClassBanner } from "./class-banner";
import { StreamPanel } from "./stream-panel";
import { UpcomingCard } from "./upcoming-card";

type StreamTabProps = {
  data: ClassPageData;
  onViewAll: () => void;
};

export function StreamTab({ data, onViewAll }: StreamTabProps) {
  const isInstructor = data.role === "instructor";
  const upcoming = nextUpcoming(data.assignments.map((a) => ({ title: a.title, dueDate: a.dueDate, status: "status" in a ? a.status : "open" })));
  const instructorName = data.instructor.email ? getDisplayName(data.instructor) : "Instructor";

  return (
    <div className="flex w-full max-w-5xl flex-col gap-3 md:gap-4">
      <ClassBanner classId={data.classId} name={data.className} instructorName={instructorName} soft={isInstructor} />
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
        <UpcomingCard next={upcoming} emptyLabel={isInstructor ? "Woohoo, no work due soon!" : undefined} onViewAll={onViewAll} />
        <StreamPanel
          classId={data.classId}
          initialPosts={data.posts}
          isInstructor={isInstructor}
          canPost={isInstructor && !data.archived}
          currentUserId={data.currentUserId}
          roster={data.roster}
          instructor={data.instructor}
        />
      </div>
    </div>
  );
}
