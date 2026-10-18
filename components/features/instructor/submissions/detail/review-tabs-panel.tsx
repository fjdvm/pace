"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnalysisTab } from "@/components/features/submissions/components/analysis-tab";
import { TutorChatTab } from "./tutor-chat-tab";
import { TestsTab } from "./tests-tab";
import type { SubmissionDetail } from "./types";

type Tab = "chat" | "tests" | "activity";

export function ReviewTabsPanel({ detail }: { detail: SubmissionDetail }) {
  const [tab, setTab] = useState<Tab>("chat");
  const tabs: { id: Tab; label: string }[] = [
    { id: "chat", label: `Tutor chat (${detail.chat.filter((m) => m.role === "assistant").length})` },
    { id: "tests", label: "Tests" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <section className="flex min-h-[320px] flex-col gap-4 overflow-hidden rounded-[20px] border-[1.5px] border-pace-line bg-white p-4">
      <div role="tablist" className="flex w-fit gap-1 rounded-full bg-pace-canvas p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold",
              tab === t.id ? "bg-white text-pace-ink shadow-sm" : "text-pace-ink-2",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === "chat" && <TutorChatTab chat={detail.chat} />}
        {tab === "tests" && <TestsTab results={detail.testResults} />}
        {tab === "activity" && detail.signals && (
          <AnalysisTab assignmentId={detail.assignment.id} studentId={detail.student.id} behavioralSignals={detail.signals} />
        )}
      </div>
    </section>
  );
}
