"use client";

import { useInView } from "motion/react";
import { useEffect, useRef } from "react";
import type { StepId } from "@/lib/study/sitting-form";

type Props = { id: StepId; onView: (id: StepId, inView: boolean) => void; children: React.ReactNode };

export function SectionFrame({ id, onView, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-30% 0px -55% 0px" });

  useEffect(() => {
    onView(id, inView);
  }, [id, inView, onView]);

  return (
    <section ref={ref} data-section={id} className="flex scroll-mt-40 flex-col gap-3.5">
      {children}
    </section>
  );
}
