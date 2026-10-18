import { useCallback } from "react";
import type { AssignmentFormValues } from "@/lib/assignment-form";

const keyFor = (id?: string) => `pace:assignment-draft:${id ?? "new"}`;

export function useAssignmentDraft(assignmentId?: string) {
  const key = keyFor(assignmentId);

  const load = useCallback((): AssignmentFormValues | null => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as AssignmentFormValues) : null;
    } catch {
      return null;
    }
  }, [key]);

  const save = useCallback(
    (values: AssignmentFormValues) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(values));
        return true;
      } catch {
        return false;
      }
    },
    [key],
  );

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {}
  }, [key]);

  return { load, save, clear };
}
