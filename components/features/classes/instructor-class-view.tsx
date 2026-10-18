"use client";

import { useState } from "react";
import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { PaceActionButton } from "@/components/features/student/shared/pace-action-button";
import { useClassActions } from "@/components/features/dashboard/instructor/components/use-class-actions";
import { splitClassName } from "@/lib/class-name";
import { ClassTabs, type ClassTab } from "./class-tabs";
import { StreamTab } from "./stream-tab";
import { ClassworkTab } from "./classwork-tab";
import { PeopleTab } from "./people-tab";
import { ClassLeaderboardTab } from "./class-leaderboard-tab";
import type { StreamPostData, RosterStudent, RosterInstructor } from "./types";

interface ClassworkAssignment {
  id: string;
  title: string;
  language: string;
  dueDate: string;
  testCaseCount: number;
  isSharedWithOtherClasses: boolean;
}

interface LeaderboardEntry {
  studentId: string;
  email: string;
  name: string | null;
  totalXp: number;
  level: number;
  rank: number;
}

interface InstructorClassViewProps {
  classId: string;
  className: string;
  joinCode: string;
  initialPosts: StreamPostData[];
  currentUserId: string;
  assignments: ClassworkAssignment[];
  roster: RosterStudent[];
  instructor: RosterInstructor;
  leaderboard: LeaderboardEntry[];
  myRank?: number;
}

export function InstructorClassView({
  classId,
  className,
  joinCode,
  initialPosts,
  currentUserId,
  assignments,
  roster,
  instructor,
  leaderboard,
  myRank,
}: InstructorClassViewProps) {
  const [activeTab, setActiveTab] = useState<ClassTab>("stream");
  const { handleArchiveToggle, handleDelete, copyToClipboard } = useClassActions();
  const { code, description } = splitClassName(className);
  const summary = { id: classId, name: className, joinCode, studentCount: roster.length, createdAt: "", archived: false };

  return (
    <>
      <StudentTopBar
        title={code}
        subtitle={description ? `${description} · ${roster.length} students` : `${roster.length} students`}
        backHref="/dashboard/instructor"
        actions={
          <div className="flex items-center gap-2">
            <PaceActionButton variant="secondary" onClick={() => copyToClipboard(joinCode)}>
              Join code {joinCode}
            </PaceActionButton>
            <PaceActionButton variant="ghost" onClick={() => handleArchiveToggle(summary)}>
              Archive
            </PaceActionButton>
            <PaceActionButton variant="ghost" className="text-pace-red" onClick={() => handleDelete(summary)}>
              Delete
            </PaceActionButton>
          </div>
        }
      />
      <main className="flex flex-1 flex-col items-center gap-6 p-4 md:p-10">
        <ClassTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "stream" && (
          <StreamTab
            classId={classId}
            initialPosts={initialPosts}
            isInstructor
            currentUserId={currentUserId}
            roster={roster}
            instructor={instructor}
          />
        )}
        {activeTab === "classwork" && <ClassworkTab classId={classId} assignments={assignments} />}
        {activeTab === "people" && <PeopleTab classId={classId} instructor={instructor} roster={roster} />}
        {activeTab === "leaderboard" && <ClassLeaderboardTab leaderboard={leaderboard} myRank={myRank} />}
      </main>
    </>
  );
}
