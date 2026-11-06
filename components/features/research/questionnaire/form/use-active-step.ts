import { useCallback, useMemo, useState } from "react";
import type { SittingForm, StepId } from "@/lib/study/sitting-form";

export function useActiveStep(form: SittingForm, initial: StepId) {
  const [visible, setVisible] = useState<StepId[]>([]);

  const report = useCallback((id: StepId, inView: boolean) => {
    setVisible((prev) => (inView ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((s) => s !== id)));
  }, []);

  const active = useMemo(
    () => form.steps.find((step) => visible.includes(step.id))?.id ?? initial,
    [form, visible, initial],
  );
  return { active, report };
}
