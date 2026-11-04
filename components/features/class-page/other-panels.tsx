import { ClassworkTab } from "@/components/features/classes/classwork-tab";
import { ClassLeaderboardTab } from "@/components/features/classes/class-leaderboard-tab";
import { PeopleTab } from "@/components/features/classes/people-tab";
import { ClassworkPanel } from "@/components/features/student/classes/classwork-panel";
import type { ClassPageData, ClassPageTab } from "./types";

type OtherPanelsProps = {
  tab: Exclude<ClassPageTab, "stream">;
  data: ClassPageData;
  onOpenStream: () => void;
};

export function OtherPanels({ tab, data, onOpenStream }: OtherPanelsProps) {
  if (tab === "people") {
    return <PeopleTab classId={data.role === "instructor" ? data.classId : undefined} instructor={data.instructor} roster={data.roster} />;
  }
  if (data.role === "instructor") {
    if (tab === "grades") return <ClassLeaderboardTab leaderboard={data.leaderboard} myRank={data.myRank} />;
    return <ClassworkTab classId={data.classId} assignments={data.assignments} />;
  }
  return <ClassworkPanel assignments={data.assignments} posts={data.posts} joinCode={data.joinCode} onOpenStream={onOpenStream} />;
}
