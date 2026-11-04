import { ClassLeaderboardTab } from "@/components/features/classes/class-leaderboard-tab";
import { InstructorClasswork } from "./classwork/instructor-classwork";
import { StudentClasswork } from "./classwork/student-classwork";
import { PeoplePanel } from "./people-panel";
import type { ClassPageData, ClassPageTab } from "./types";

type OtherPanelsProps = {
  tab: Exclude<ClassPageTab, "stream">;
  data: ClassPageData;
};

export function OtherPanels({ tab, data }: OtherPanelsProps) {
  if (tab === "people") return <PeoplePanel data={data} />;
  if (data.role === "instructor") {
    if (tab === "grades") return <ClassLeaderboardTab leaderboard={data.leaderboard} myRank={data.myRank} />;
    return (
      <InstructorClasswork classId={data.classId} joinCode={data.joinCode} archived={data.archived} items={data.assignments} />
    );
  }
  return <StudentClasswork items={data.assignments} />;
}
