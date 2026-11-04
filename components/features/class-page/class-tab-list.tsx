import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tabsFor } from "./tab-config";

export function ClassTabList({ isInstructor }: { isInstructor: boolean }) {
  return (
    <TabsList
      variant="line"
      className="hidden h-auto w-full justify-center gap-2 rounded-none border-b border-pace-line p-0 md:flex group-data-horizontal/tabs:h-auto"
    >
      {tabsFor(isInstructor).map((tab) => (
        <TabsTrigger
          key={tab.id}
          value={tab.id}
          className="h-auto w-[100px] flex-none rounded-none px-4 pb-[14px] pt-[14px] text-[15px] font-normal text-pace-ink-2 data-active:font-bold data-active:text-pace-green-deep group-data-horizontal/tabs:after:bottom-0 group-data-horizontal/tabs:after:h-1 after:rounded-t-[3px] after:bg-pace-green"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
