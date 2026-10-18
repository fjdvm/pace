"use client";

import { PaceActionButton } from "@/components/features/student/shared/pace-action-button";
import { toCsv } from "@/lib/assignment-overview";
import type { AssignmentOverview } from "./types";

export function ExportScoresButton({ overview }: { overview: AssignmentOverview }) {
  const download = () => {
    const rows = [
      ["Student", "Email", "Status", "Score", "Hearts used", "Submitted at"],
      ...overview.students.map((s) => [
        s.name,
        s.email,
        s.status,
        s.score === null ? "" : Math.round(s.score),
        s.hearts,
        s.submittedAt ?? "",
      ]),
    ];
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${overview.assignment.title.replace(/[^\w]+/g, "-").toLowerCase()}-scores.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PaceActionButton variant="secondary" onClick={download}>
      Export scores
    </PaceActionButton>
  );
}
