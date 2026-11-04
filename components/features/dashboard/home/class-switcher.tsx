"use client";

import { useState } from "react";
import { Check, UserRoundCog } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassGrid } from "./class-grid";

type ClassItem = { id: string; name: string; instructorName: string };
type View = "Teaching" | "Enrolled";

type ClassSwitcherProps = {
  teaching: ClassItem[];
  enrolled: ClassItem[];
};

const trigger =
  "h-9 flex-none gap-2 rounded-none border-0 px-5 text-sm font-bold text-pace-ink data-active:bg-sky-200 data-active:text-pace-ink after:hidden [&_svg]:size-4";

export function ClassSwitcher({ teaching, enrolled }: ClassSwitcherProps) {
  const [view, setView] = useState<View>(teaching.length > 0 ? "Teaching" : "Enrolled");
  const both = teaching.length > 0 && enrolled.length > 0;

  return (
    <>
      {both && (
        <Tabs value={view} onValueChange={(next) => setView(next as View)} className="gap-0 sm:mx-auto sm:w-full sm:max-w-[1392px]">
          <TabsList className="h-9 overflow-hidden rounded-full border border-pace-line-strong bg-white p-0">
            <TabsTrigger value="Teaching" className={trigger}>
              <UserRoundCog strokeWidth={1.5} />
              Teaching
            </TabsTrigger>
            <TabsTrigger value="Enrolled" className={`${trigger} border-l border-pace-line-strong`}>
              <Check strokeWidth={1.5} />
              Enrolled
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      <ClassGrid title={view} classes={view === "Teaching" ? teaching : enrolled} />
    </>
  );
}
