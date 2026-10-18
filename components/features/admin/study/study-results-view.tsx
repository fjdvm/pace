"use client";

import { useState } from "react";
import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import type { StudyTab, StudyViewData } from "./study-types";
import { StudyTabs } from "./study-tabs";
import { StudyHeaderActions } from "./study-header-actions";
import { OverviewTab } from "./overview-tab";
import { ItemsTab } from "./items-tab";
import { CommentsTab } from "./comments-tab";
import { RespondentsTab } from "./respondents-tab";
import { EmptyStateCard } from "./empty-state-card";
import { QuestionnaireLink } from "./questionnaire-link";

const closedDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function StudyResultsView({ data }: { data: StudyViewData }) {
  const [tab, setTab] = useState<StudyTab>("overview");
  const { student, instructor } = data.results.responses;
  const empty = student.count + instructor.count === 0;
  const status = data.closedAt ? `Questionnaire closed ${closedDate.format(new Date(data.closedAt))}` : "Questionnaire open";

  return (
    <>
      <StudentTopBar
        title="Study results"
        subtitle={`PACE acceptability evaluation · ${status}`}
        hideBell
        actions={<StudyHeaderActions closed={!!data.closedAt} />}
      />
      <main className="flex flex-1 flex-col gap-5 p-4 md:px-8 md:py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StudyTabs active={tab} onChange={setTab} />
          {!empty && <QuestionnaireLink path={data.questionnairePath} />}
        </div>
        {empty && tab === "overview" && <EmptyStateCard path={data.questionnairePath} closed={!!data.closedAt} />}
        {tab === "overview" && <OverviewTab data={data} onNavigate={setTab} />}
        {tab === "items" && <ItemsTab items={data.results.items} />}
        {tab === "comments" && <CommentsTab comments={data.comments} />}
        {tab === "respondents" && <RespondentsTab respondents={data.respondents} />}
      </main>
    </>
  );
}
