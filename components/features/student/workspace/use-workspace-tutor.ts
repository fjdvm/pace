"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import type {
  AssignmentData,
  ChatMessageData,
  TestRunResult,
} from "@/components/features/assignments/types";
type Props = {
  assignment: AssignmentData;
  initialChatMessages: ChatMessageData[];
  code: string;
  runResults: TestRunResult[] | null;
  submitted: boolean;
  hearts: number;
  spendHeart: (atMax: boolean) => void;
};
export function useWorkspaceTutor({
  assignment,
  initialChatMessages,
  code,
  runResults,
  submitted,
  hearts,
  spendHeart,
}: Props) {
  const [chatInput, setChatInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    throttle: 50,
    messages: initialChatMessages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      parts: [{ type: "text" as const, text: msg.content }],
    })),
    onError: (err: Error) =>
      toast.error(err.message || "Failed to send message."),
  });
  const isLoading = status === "submitted" || status === "streaming";
  const codeRef = useRef(code);
  const resultsRef = useRef(runResults);
  useEffect(() => {
    codeRef.current = code;
    resultsRef.current = runResults;
  }, [code, runResults]);

  const sendToTutor = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      if (submitted) return toast.error("Chat is read-only.");
      if (hearts <= 0) return toast.error("0 hearts remaining.");
      spendHeart(hearts === assignment.heartsCount);
      sendMessage(
        { text },
        {
          body: {
            assignmentId: assignment.id,
            currentCode: codeRef.current,
            lastRunResults: resultsRef.current,
          },
        },
      );
      setChatInput("");
    },
    [
      submitted,
      hearts,
      assignment.heartsCount,
      assignment.id,
      spendHeart,
      sendMessage,
    ],
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
    chatInput,
    setChatInput,
    chatMessages,
    isLoading,
    isStreaming: status === "streaming",
    sendToTutor,
  };
}
