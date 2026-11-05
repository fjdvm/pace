"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { itemWorkStatus } from "@/lib/items/work-status";
import { workspaceEntry } from "./workspace-entry";
import { workspaceItems } from "./workspace-items";
import { useWorkspaceTutor } from "./use-workspace-tutor";
import { toast } from "sonner";
import { runCode } from "@/app/actions/run-code";
import { submitCode } from "@/app/actions/submit-code";
import { useItemDrafts } from "./use-item-drafts";
import { useBehavioralTracking } from "@/components/features/assignments/tracking/use-behavioral-tracking";

import type {
  WorkspaceViewProps,
  TestRunResult,
  SubmissionData,
} from "@/components/features/assignments/types";
import type { SubmitReward } from "./reward";

type RunResponseResult = TestRunResult;

export function useWorkspace(props: WorkspaceViewProps) {
  const { assignment, initialSubmission } = props;
  const router = useRouter();
  const items = useMemo(() => workspaceItems(props), [props]);
  const entry = workspaceEntry(items, props.initialItemId);
  const [activeId, setActiveId] = useState(entry.activeId);
  const [overview, setOverview] = useState(entry.overview);
  const activeItem = items.find((i) => i.id === activeId)!;
  const [submission, setSubmission] = useState<SubmissionData | null>(
    initialSubmission,
  );
  const drafts = useItemDrafts(assignment.id, items, !!submission);
  const code = drafts.codes[activeId];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const submittingRef = useRef(false);
  const [itemResults, setItemResults] = useState<
    Record<string, TestRunResult[] | null>
  >(() => Object.fromEntries(items.map((i) => [i.id, i.testResults])));
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const runResults = itemResults[activeId] ?? null;
  const setRunResults = (results: TestRunResult[] | null) =>
    setItemResults((previous) => ({ ...previous, [activeId]: results }));
  const [ranAt, setRanAt] = useState<number | null>(
    initialSubmission ? Date.parse(initialSubmission.submittedAt) : null,
  );
  const [consoleOutput, setConsoleOutput] = useState("");
  const [reward, setReward] = useState<SubmitReward | null>(null);
  const [resultOpen, setResultOpen] = useState(false);

  const autosaveStatus = drafts.status;
  const tutor = useWorkspaceTutor({
    props,
    items,
    activeId,
    code,
    runResults,
    submitted: !!submission,
  });
  const {
    handleEditorMount,
    recordKeystroke,
    recordRunAttempt,
    collectSignals,
  } = useBehavioralTracking(!!submission);

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      if (submission) return;
      drafts.updateCode(activeId, value ?? "");
      setItemResults((previous) => ({ ...previous, [activeId]: null }));
      recordKeystroke();
    },
    [submission, recordKeystroke, drafts, activeId],
  );

  const handleRun = async () => {
    if (submission) return;
    setIsRunning(true);
    setRunResults(null);
    setConsoleOutput("");
    try {
      const response = await runCode(assignment.id, code, activeId);
      if (!response.success || !response.results) {
        setConsoleOutput(`ERROR: ${response.error}`);
        toast.error(response.error || "Failed to execute");
        return;
      }
      const results = response.results as RunResponseResult[];
      setRunResults(results);
      setRanAt(Date.now());
      const passed = results.filter((r) => r.passed).length;
      recordRunAttempt(passed, results.length);
      const compileErr = results.find((r) => r.compileOutput);
      const runtimeErr = results.find((r) => r.stderr);
      if (compileErr) {
        setConsoleOutput(`COMPILATION ERROR:\n${compileErr.compileOutput}`);
        toast.error("Compilation error!");
      } else if (runtimeErr && results.every((r) => !r.passed)) {
        setConsoleOutput(`RUNTIME ERROR:\n${runtimeErr.stderr}`);
        toast.error("Runtime error!");
      } else {
        setConsoleOutput(
          `Passed ${passed}/${results.length} visible test cases.`,
        );
      }
    } catch {
      setConsoleOutput("Connection failed.");
      toast.error("Unexpected error.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (submission || submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setConsoleOutput("");
    const signals = collectSignals();
    try {
      const response = await submitCode(
        assignment.id,
        code,
        signals,
        items.map((i) => ({ itemId: i.id, code: drafts.codes[i.id] })),
      );
      if (response.success && response.submission) {
        setSubmission(response.submission);
        if (response.answers)
          setItemResults(
            Object.fromEntries(
              response.answers.map((a) => [a.itemId, a.testResults]),
            ),
          );
        setConfirmOpen(false);
        setRanAt(Date.now());
        setReward(response.reward ?? null);
        setResultOpen(true);
        router.refresh();
      } else {
        setConsoleOutput(`ERROR: ${response.error}`);
        toast.error(response.error || "Submit failed");
      }
    } catch {
      setConsoleOutput("Connection failed.");
      toast.error("Unexpected error.");
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  const statuses = Object.fromEntries(
    items.map((item) => [
      item.id,
      itemWorkStatus(item, drafts.codes[item.id], itemResults[item.id]),
    ]),
  );
  return {
    dueDate: assignment.dueDate,
    overview,
    setOverview,
    statuses,
    done: Object.values(statuses).filter((status) => status === "answered")
      .length,
    async leave(href: string) {
      if (submission || (await drafts.flush())) router.push(href);
      else toast.error("Save failed. Please try again before leaving.");
    },
    codes: drafts.codes,
    items,
    activeItem,
    activeId,
    setActiveId(id: string) {
      if (isRunning || isSubmitting) return;
      setActiveId(id);
      setOverview(false);
      setConsoleOutput("");
      setRanAt(null);
    },
    itemResults,
    confirmOpen,
    setConfirmOpen,
    code,
    autosaveStatus,
    submission,
    runResults,
    ranAt,
    consoleOutput,
    ...tutor,
    isRunning,
    isSubmitting,
    reward,
    resultOpen,
    setResultOpen,
    handleCodeChange,
    handleEditorMount,
    handleRun,
    handleSubmit,
  };
}
