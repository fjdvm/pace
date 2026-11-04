"use client";

import { useMemo, useState } from "react";
import type { StudentClass } from "@/components/features/student/types";
import { ALL_CLASSES, ClassFilter } from "./class-filter";
import { groupAssigned, tabOf, type TodoTab } from "./group-todos";
import { TodoEmpty } from "./todo-empty";
import { TodoGroup } from "./todo-group";
import { TodoTabs } from "./todo-tabs";

export function TodoView({ classes }: { classes: StudentClass[] }) {
  const [tab, setTab] = useState<TodoTab>("assigned");
  const [classId, setClassId] = useState(ALL_CLASSES);

  const inTab = useMemo(() => {
    const now = new Date();
    return classes
      .filter((c) => classId === ALL_CLASSES || c.id === classId)
      .flatMap((c) => c.assignments)
      .filter((a) => tabOf(a, now) === tab);
  }, [classes, classId, tab]);

  const groups = useMemo(() => groupAssigned(inTab), [inTab]);
  const flat = useMemo(() => [...inTab].sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [inTab]);

  return (
    <div className="flex flex-1 flex-col">
      <TodoTabs value={tab} onChange={setTab} />
      <div className="mx-auto flex w-full max-w-[800px] flex-col px-4 py-6 md:px-0">
        <div className="flex">
          <ClassFilter classes={classes} value={classId} onChange={setClassId} />
        </div>
        {inTab.length === 0 && <TodoEmpty tab={tab} />}
        {tab === "assigned" ? (
          <>
            <TodoGroup title="This week" assignments={groups.thisWeek} />
            <TodoGroup title="Next week" assignments={groups.nextWeek} />
            <TodoGroup title="Later" assignments={groups.later} />
          </>
        ) : (
          <TodoGroup assignments={flat} />
        )}
      </div>
    </div>
  );
}
