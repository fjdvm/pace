"use client";

import { useState } from "react";
import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import type { StudyTab, StudyViewData } from "./study-types";
import { StudyTabs } from "./study-tabs";
import { StudyHeaderActions } from "./study-header-actions";
import { OverviewTab } from "./overview-tab";
import { ItemsTab } from "./items-tab";
import { CommentsTab } from "./comments-tab";
import { RespondentsTab } from "./respondents-tab";

const closedDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function StudyResultsView({ data }: { data: StudyViewData }) {
  const [tab, setTab] = useState<StudyTab>("overview");
  const status = data.closedAt ? `Questionnaire closed ${closedDate.format(new Date(data.closedAt))}` : "Questionnaire open";

  return (
    <>
      <StudentTopBar
        title="Study results"
        subtitle={
          <>
            <span>PACE acceptability evaluation · {status}</span>
            {data.isSample && (
              <PaceTag tone="amber" className="px-2.5 py-0.5 text-[11px]">
                Sample data
              </PaceTag>
            )}
          </>
        }
        hideBell
        actions={<StudyHeaderActions closed={!!data.closedAt} />}
      />
      <main className="flex flex-1 flex-col gap-5 p-4 md:px-8 md:py-6">
        <StudyTabs active={tab} onChange={setTab} />
        {tab === "overview" && <OverviewTab data={data} onNavigate={setTab} />}
        {tab === "items" && <ItemsTab items={data.results.items} />}
        {tab === "comments" && <CommentsTab comments={data.comments} />}
        {tab === "respondents" && <RespondentsTab respondents={data.respondents} />}
      </main>
    </>
  );
}
