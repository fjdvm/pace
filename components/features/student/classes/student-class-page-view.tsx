"use client";

import { useState } from "react";
import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { StreamTab } from "@/components/features/classes/stream-tab";
import { PeopleTab } from "@/components/features/classes/people-tab";
import { getDisplayName } from "@/lib/display-name";
import type { StreamPostData, RosterStudent, RosterInstructor } from "@/components/features/classes/types";
import type { StudentAssignment } from "@/components/features/student/types";
import { ClassTabPills, type StudentClassTab } from "./class-tab-pills";
import { ClassworkPanel } from "./classwork-panel";
import { LeaderboardPanel } from "./leaderboard-panel";
import type { LeaderboardEntry } from "./leaderboard-types";

type StudentClassPageViewProps = {
  classId: string;
  className: string;
  joinCode: string;
  classArchived: boolean;
  currentUserId: string;
  assignments: StudentAssignment[];
  posts: StreamPostData[];
  roster: RosterStudent[];
  instructor: RosterInstructor;
  leaderboard: LeaderboardEntry[];
};

export function StudentClassPageView(props: StudentClassPageViewProps) {
  const [tab, setTab] = useState<StudentClassTab>("classwork");
  const { instructor, roster } = props;
  const owner = instructor.email ? getDisplayName(instructor) : "Instructor";

  return (
    <>
      <StudentTopBar
        title={props.className}
        subtitle={`Prof. ${owner} · ${roster.length} ${roster.length === 1 ? "student" : "students"}`}
        backHref="/dashboard/student"
        leadingIcon={
          <span className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-pace-green-tint sm:flex">
            <PaceIcon name="cap-header" size={18} />
          </span>
        }
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:px-10 md:pb-8 md:pt-7">
        {props.classArchived && (
          <p className="rounded-2xl bg-pace-amber-tint px-4 py-3 text-[13px] text-pace-ink">
            This class has been archived by the instructor. It is now read-only.
          </p>
        )}
        <ClassTabPills active={tab} onChange={setTab} />
        {tab === "classwork" && (
          <ClassworkPanel
            assignments={props.assignments}
            posts={props.posts}
            joinCode={props.joinCode}
            onOpenStream={() => setTab("stream")}
          />
        )}
        {tab === "stream" && (
          <div className="flex justify-center">
            <StreamTab
              classId={props.classId}
              initialPosts={props.posts}
              isInstructor={false}
              currentUserId={props.currentUserId}
              roster={roster}
              instructor={instructor}
            />
          </div>
        )}
        {tab === "people" && (
          <div className="flex justify-center">
            <PeopleTab instructor={instructor} roster={roster} />
          </div>
        )}
        {tab === "leaderboard" && (
          <LeaderboardPanel leaderboard={props.leaderboard} currentUserId={props.currentUserId} />
        )}
      </main>
    </>
  );
}
