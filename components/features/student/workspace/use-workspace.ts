"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { runCode } from "@/app/actions/run-code";
import { submitCode } from "@/app/actions/submit-code";
import { useHeartsTimer } from "@/components/features/assignments/use-hearts-timer";
import { useAutosave } from "@/components/features/assignments/use-autosave";
import { useBehavioralTracking } from "@/components/features/assignments/tracking/use-behavioral-tracking";
import { DEFAULT_CODE_TEMPLATES } from "@/components/features/assignments/code-templates";
import type { WorkspaceViewProps, TestRunResult, SubmissionData } from "@/components/features/assignments/types";
import type { SubmitReward } from "./reward";

type RunResponseResult = TestRunResult;

export function useWorkspace(props: WorkspaceViewProps) {
  const { assignment, initialHearts, initialSubmission, initialChatMessages, initialDraftCode } = props;
  const router = useRouter();
  const [code, setCode] = useState(
    initialSubmission?.code || initialDraftCode || DEFAULT_CODE_TEMPLATES[assignment.language] || "",
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<SubmissionData | null>(initialSubmission);
  const [runResults, setRunResults] = useState<TestRunResult[] | null>(
    initialSubmission ? (initialSubmission.testResults as TestRunResult[]) : null,
  );
  const [ranAt, setRanAt] = useState<number | null>(initialSubmission ? Date.parse(initialSubmission.submittedAt) : null);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [reward, setReward] = useState<SubmitReward | null>(null);
  const [resultOpen, setResultOpen] = useState(false);

  const { hearts, timeToRegen, spendHeart } = useHeartsTimer({
    initialHearts,
    maxHearts: assignment.heartsCount,
    regenMinutes: assignment.heartsRegenMinutes,
  });
  const { status: autosaveStatus } = useAutosave({ assignmentId: assignment.id, code, isSubmitted: !!submission });
  const { messages, sendMessage, status } = useChat({
    throttle: 50,
    messages: initialChatMessages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      parts: [{ type: "text" as const, text: msg.content }],
    })),
    onError: (err: Error) => toast.error(err.message || "Failed to send message."),
  });
  const isLoading = status === "submitted" || status === "streaming";
  const { handleEditorMount, recordKeystroke, recordRunAttempt, collectSignals } = useBehavioralTracking(!!submission);

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      if (submission) return;
      setCode(value || "");
      recordKeystroke();
    },
    [submission, recordKeystroke],
  );

  const handleRun = async () => {
    if (submission) return;
    setIsRunning(true);
    setRunResults(null);
    setConsoleOutput("");
    try {
      const response = await runCode(assignment.id, code);
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
        setConsoleOutput(`Passed ${passed}/${results.length} visible test cases.`);
        if (passed === results.length) toast.success("All visible test cases passed!");
        else toast.warning(`Passed ${passed}/${results.length}`);
      }
    } catch {
      setConsoleOutput("Connection failed.");
      toast.error("Unexpected error.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (submission) return;
    if (!window.confirm("Submit your code? You can only submit once.")) return;
    setIsSubmitting(true);
    setConsoleOutput("");
    const signals = collectSignals();
    try {
      const response = await submitCode(assignment.id, code, signals);
      if (response.success && response.submission) {
        setSubmission(response.submission);
        setRunResults(response.submission.testResults as TestRunResult[]);
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
    }
  };

  const codeRef = useRef(code);
  const resultsRef = useRef(runResults);
  useEffect(() => {
    codeRef.current = code;
    resultsRef.current = runResults;
  }, [code, runResults]);

  const sendToTutor = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      if (submission) return toast.error("Chat is read-only.");
      if (hearts.currentCount <= 0) return toast.error("0 hearts remaining.");
      spendHeart(hearts.currentCount === assignment.heartsCount);
      sendMessage(
        { text },
        { body: { assignmentId: assignment.id, currentCode: codeRef.current, lastRunResults: resultsRef.current } },
      );
      setChatInput("");
    },
    [submission, hearts.currentCount, assignment.heartsCount, assignment.id, spendHeart, sendMessage],
  );

  const chatMessages = useMemo(
    () =>
      messages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.parts
          .filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join(""),
      })),
    [messages],
  );

  return {
    code,
    hearts,
    timeToRegen,
    autosaveStatus,
    submission,
    runResults,
    ranAt,
    consoleOutput,
    chatInput,
    setChatInput,
    chatMessages,
    isLoading,
    isStreaming: status === "streaming",
    isRunning,
    isSubmitting,
    reward,
    resultOpen,
    setResultOpen,
    handleCodeChange,
    handleEditorMount,
    handleRun,
    handleSubmit,
    sendToTutor,
  };
}
