import type { StudyTab, StudyViewData } from "./study-types";
import { SummaryCards } from "./summary-cards";
import { AcceptabilityCard } from "./acceptability-card";
import { ReliabilityCard } from "./reliability-card";
import { ComparisonCard } from "./comparison-card";
import { ThemesCard } from "./themes-card";

type OverviewTabProps = {
  data: StudyViewData;
  onNavigate: (tab: StudyTab) => void;
};

export function OverviewTab({ data, onNavigate }: OverviewTabProps) {
  const { results } = data;
  return (
    <div className="flex flex-col gap-5">
      <SummaryCards results={results} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <AcceptabilityCard constructs={results.constructs} />
        <ReliabilityCard reliability={results.reliability} closed={!!data.closedAt} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <ComparisonCard rows={results.comparison} />
        <ThemesCard themes={results.themes} commentCount={results.commentCount} onSeeAll={() => onNavigate("comments")} />
      </div>
    </div>
  );
}
