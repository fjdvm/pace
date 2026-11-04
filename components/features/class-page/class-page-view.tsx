"use client";

import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ClassBottomNav } from "./class-bottom-nav";
import { ClassTabList } from "./class-tab-list";
import { OtherPanels } from "./other-panels";
import { StreamTab } from "./stream/stream-tab";
import { tabsFor } from "./tab-config";
import type { ClassPageData, ClassPageTab } from "./types";

export function ClassPageView({ data }: { data: ClassPageData }) {
  const [tab, setTab] = useState<ClassPageTab>("stream");
  const isInstructor = data.role === "instructor";
  const others = tabsFor(isInstructor).filter((t) => t.id !== "stream");

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as ClassPageTab)} className="min-h-full gap-0">
      <ClassTabList isInstructor={isInstructor} />
      <div className="flex flex-1 flex-col items-center gap-4 p-4 md:px-6 md:py-6">
        {data.archived && (
          <p className="w-full max-w-5xl rounded-lg bg-pace-amber-tint px-4 py-3 text-[13px] text-pace-ink">
            This class has been archived. It is now read-only.
          </p>
        )}
        <TabsContent value="stream" className="flex w-full justify-center text-[15px]">
          <StreamTab data={data} onViewAll={() => setTab("classwork")} />
        </TabsContent>
        {others.map((t) => (
          <TabsContent key={t.id} value={t.id} className="w-full max-w-5xl">
            <OtherPanels tab={t.id as Exclude<ClassPageTab, "stream">} data={data} />
          </TabsContent>
        ))}
      </div>
      <ClassBottomNav active={tab} isInstructor={isInstructor} onChange={setTab} />
    </Tabs>
  );
}
