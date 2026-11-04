import { ClassLeaderboardTab } from "@/components/features/classes/class-leaderboard-tab";
import { PeopleTab } from "@/components/features/classes/people-tab";
import type { ClassPageData } from "./types";

export function PeoplePanel({ data }: { data: ClassPageData }) {
  const isInstructor = data.role === "instructor";
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <PeopleTab classId={isInstructor ? data.classId : undefined} instructor={data.instructor} roster={data.roster} />
      {!isInstructor && <ClassLeaderboardTab leaderboard={data.leaderboard} myRank={data.myRank} />}
    </div>
  );
}
