import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { QuestionnaireVersion } from "@/lib/study/questionnaire";

const KEY = "pace:questionnaire-submitted";
const listeners = new Set<() => void>();

export type SubmittedSummary = { version: QuestionnaireVersion; ratings: number; comments: number };

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readRaw() {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function useSubmittedSummary() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const summary = useMemo<SubmittedSummary | null>(() => {
    try {
      return raw ? (JSON.parse(raw) as SubmittedSummary) : null;
    } catch {
      return null;
    }
  }, [raw]);

  const remember = useCallback((next: SubmittedSummary) => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    listeners.forEach((listener) => listener());
  }, []);

  return { summary, remember };
}
