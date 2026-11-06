"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMotionEnabled } from "../shared/use-motion-enabled";
import { StudentsBands } from "./students-bands";
import { InstructorsBands } from "./instructors-bands";

const options = ["Students", "Instructors"] as const;
type Audience = (typeof options)[number];

export function AudienceToggle() {
  const [active, setActive] = useState<Audience>("Students");
  const motionEnabled = useMotionEnabled();

  return (
    <Tabs value={active} onValueChange={(v) => setActive(v as Audience)} className="w-full items-center gap-10">
      <TabsList className="h-auto gap-0 rounded-full bg-[#eae9e6] p-0">
        {options.map((option) => (
          <TabsTrigger
            key={option}
            value={option}
            className="relative isolate h-[46px] w-[170px] flex-none rounded-full border-0 bg-transparent px-0 py-0 font-lp-sans text-[15px] font-medium text-[#9a9a9a] after:hidden data-active:bg-transparent data-active:font-semibold data-active:text-white data-active:shadow-none hover:text-[#9a9a9a] data-active:hover:text-white sm:h-[52px] sm:w-[207px]"
          >
            {active === option && (
              <motion.span
                layoutId="audience-pill"
                transition={motionEnabled ? { type: "spring", stiffness: 400, damping: 34 } : { duration: 0 }}
                className="absolute inset-0 -z-10 rounded-full bg-lp-ink"
              />
            )}
            {option}
          </TabsTrigger>
        ))}
      </TabsList>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          role="tabpanel"
          aria-label={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionEnabled ? 0.25 : 0 }}
          className={active === "Students" ? "flex w-full flex-col pt-4" : "flex w-full flex-col"}
        >
          {active === "Students" ? <StudentsBands /> : <InstructorsBands />}
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
}
