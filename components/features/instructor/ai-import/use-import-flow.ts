"use client";
import { useRef, useState } from "react";
import { extractItems } from "@/app/actions/ai-import/extract-items";
import { checkImportFile } from "@/lib/ai-import/file-rules";
import type { ExtractedDraft, ImportSettings } from "@/lib/ai-import/types";

export const DEFAULT_SETTINGS: ImportSettings = { language: "Python", kinds: "auto", writeTests: true, detectKeys: true };

export function useImportFlow(classId: string, onDraft: (draft: ExtractedDraft) => void) {
  const [reading, setReading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [error, setError] = useState<string | null>(null);
  const run = useRef(0);

  const choose = (next: File | null) => {
    if (next) {
      const checked = checkImportFile(next);
      if ("error" in checked) return setError(checked.error);
    }
    setError(null);
    setFile(next);
  };
  const start = async () => {
    if (!file) return;
    const id = ++run.current;
    setReading(true);
    setError(null);
    const form = new FormData();
    form.set("file", file);
    form.set("classId", classId);
    form.set("language", settings.language);
    form.set("kinds", settings.kinds);
    form.set("writeTests", String(settings.writeTests));
    form.set("detectKeys", String(settings.detectKeys));
    const result = await extractItems(form).catch(() => ({ success: false as const, error: "We could not reach the server. Try again." }));
    if (id !== run.current) return;
    setReading(false);
    if (!result.success) return setError(result.error);
    setFile(null);
    onDraft(result.draft);
  };
  const cancel = () => { run.current++; setReading(false); };
  return { reading, file, settings, error, setSettings, choose, start, cancel };
}
