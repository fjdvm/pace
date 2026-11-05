"use client";

import { useEffect, useRef, useState } from "react";
import { saveDraft } from "@/app/actions/save-draft";
import type { WorkspaceItem } from "@/components/features/assignments/types";
import { DEFAULT_CODE_TEMPLATES } from "@/components/features/assignments/code-templates";
import type { AutosaveStatus } from "@/components/features/assignments/use-autosave";

export function useItemDrafts(
  postId: string,
  items: WorkspaceItem[],
  submitted: boolean,
) {
  const [codes, setCodes] = useState(() =>
    Object.fromEntries(
      items.map((i) => [
        i.id,
        i.code ?? (i.kind === "multiple_choice" || i.kind === "short_answer" ? "" : (i.starterCode || DEFAULT_CODE_TEMPLATES[i.language] || "")),
      ]),
    ),
  );
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const codesRef = useRef(codes);
  const saved = useRef({ ...codes });
  const queue = useRef(Promise.resolve(true));
  const submittedRef = useRef(submitted);
  useEffect(() => {
    submittedRef.current = submitted;
  }, [submitted]);
  function updateCode(id: string, code: string) {
    codesRef.current = { ...codesRef.current, [id]: code };
    setCodes(codesRef.current);
    setStatus("saving");
  }
  function flush() {
    const snapshot = { ...codesRef.current };
    queue.current = queue.current
      .catch(() => false)
      .then(async () => {
        if (submittedRef.current) return true;
        try {
          for (const [id, code] of Object.entries(snapshot)) {
            if (saved.current[id] === code) continue;
            const result = await saveDraft(postId, code, id);
            if (!result.success) throw new Error(result.error);
            saved.current[id] = code;
          }
          const current = Object.entries(codesRef.current).every(
            ([id, code]) => saved.current[id] === code,
          );
          setStatus(current ? "saved" : "saving");
          return true;
        } catch {
          setStatus("error");
          return false;
        }
      });
    return queue.current;
  }
  const flushRef = useRef(flush);
  useEffect(() => {
    flushRef.current = flush;
  });
  useEffect(() => () => { void flushRef.current(); }, []);
  useEffect(() => {
    if (submitted) return;
    const timer = setTimeout(() => {
      void flushRef.current();
    }, 1200);
    return () => clearTimeout(timer);
  }, [codes, submitted]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (
        !submittedRef.current &&
        Object.entries(codesRef.current).some(
          ([id, code]) => saved.current[id] !== code,
        )
      )
        event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  return { codes, updateCode, status, flush };
}
