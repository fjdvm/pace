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
  const upcoming = data.role === "student" ? nextUpcoming(data.assignments) : null;
  const instructorName = data.instructor.email ? getDisplayName(data.instructor) : "Instructor";

  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-3 md:gap-4">
      <ClassBanner classId={data.classId} name={data.className} instructorName={instructorName} />
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
        {!isInstructor && <UpcomingCard next={upcoming} onViewAll={onViewAll} />}
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
