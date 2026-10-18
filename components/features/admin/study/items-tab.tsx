"use client";

import { useState } from "react";
import { CONSTRUCTS, type ConstructId } from "@/lib/study/questionnaire";
import type { StudyRole } from "@/lib/study/dataset";
import type { StudyResults } from "@/lib/study/analysis";
import { ItemFilters } from "./items/item-filters";
import { ConstructItemsCard } from "./items/construct-items-card";
import { ItemInsights } from "./items/item-insights";

export function ItemsTab({ results }: { results: StudyResults }) {
  const [group, setGroup] = useState<StudyRole>("student");
  const [construct, setConstruct] = useState<ConstructId>(CONSTRUCTS[0].id);
  const items = results.items.filter((i) => i.constructId === construct);

  return (
    <div className="flex flex-col gap-5">
      <ItemFilters
        group={group}
        construct={construct}
        counts={{ student: results.responses.student.count, instructor: results.responses.instructor.count }}
        onGroup={setGroup}
        onConstruct={setConstruct}
      />
      <ConstructItemsCard results={results} group={group} construct={construct} />
      <ItemInsights items={items} group={group} />
    </div>
  );
}
