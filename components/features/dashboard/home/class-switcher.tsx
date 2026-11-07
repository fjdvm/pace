"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, UserRoundCog } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resolveHomeView, saveHomeView, type HomeView } from "@/lib/home-view";
import type { TeachingHomeClass } from "@/app/actions/teaching-home";
import { TeachingGrid } from "./teaching-grid";
import { ClassGrid } from "./class-grid";

type ClassItem = { id: string; name: string; instructorName: string; todoCount?: number };
type View = HomeView;

type ClassSwitcherProps = {
  teaching: TeachingHomeClass[];
  enrolled: ClassItem[];
  savedView?: string;
};

const trigger =
  "h-full flex-none gap-2 rounded-none border-0 px-3 text-[13px] font-semibold leading-5 text-pace-ink hover:text-pace-ink data-active:bg-[#c2e7ff] data-active:text-pace-ink after:hidden [&_svg]:size-[18px]";

export function ClassSwitcher({ teaching, enrolled, savedView }: ClassSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const both = teaching.length > 0 && enrolled.length > 0;
  const view = resolveHomeView(params.get("tab"), savedView, teaching.length > 0, enrolled.length > 0);

  function select(next: View) {
    saveHomeView(next);
    router.replace(`${pathname}?tab=${next.toLowerCase()}`, { scroll: false });
  }

  return (
    <>
      {both && (
        <Tabs value={view} onValueChange={(next) => select(next as View)} className="gap-0 sm:mx-auto sm:w-full sm:max-w-7xl">
          <TabsList className="h-10 group-data-horizontal/tabs:h-10 overflow-hidden rounded-full border border-[#747775] bg-transparent p-0">
            <TabsTrigger value="Teaching" className={trigger}>
              <UserRoundCog strokeWidth={1.5} />
              Teaching
            </TabsTrigger>
            <TabsTrigger value="Enrolled" className={`${trigger} border-l border-[#747775] pl-3.5 pr-4`}>
              <Check strokeWidth={1.5} />
              Enrolled
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      {view === "Teaching" ? <TeachingGrid classes={teaching} /> : <ClassGrid title="Enrolled" classes={enrolled} />}
    </>
  );
}
