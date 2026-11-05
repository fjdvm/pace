"use client";
import { useMemo, useState } from "react";
import { Chat, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";
import { startAssignment } from "@/app/actions/start-assignment";
import { useItemHearts } from "./use-item-hearts";
import type { WorkspaceViewProps, WorkspaceItem, TestRunResult } from "@/components/features/assignments/types";

type Props = {
  props: WorkspaceViewProps;
  items: WorkspaceItem[];
  activeId: string;
  code: string;
  runResults: TestRunResult[] | null;
  submitted: boolean;
};

export function useWorkspaceTutor({ props, items, activeId, code, runResults, submitted }: Props) {
  const { assignment } = props;
  const { hearts, timeToRegen, refillMinutes, updateHearts } = useItemHearts(props, activeId);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [chats] = useState(() => Object.fromEntries(items.map((item) => [item.id, new Chat({
    id: item.id,
    messages: (props.initialTutorStates?.[item.id]?.messages ?? props.initialChatMessages).map((msg) => ({
      id: msg.id, role: msg.role, parts: [{ type: "text" as const, text: msg.content }],
    })),
    transport: new DefaultChatTransport({
      fetch: async (url, options) => {
        const response = await fetch(url, options);
        const state = response.headers.get("X-Hearts-State");
        if (state) updateHearts(item.id, JSON.parse(state));
        if (!response.ok) {
          const result = await startAssignment(assignment.id, item.id);
          if (result.success && result.heartsState) updateHearts(item.id, {
            ...result.heartsState, lastRegenAt: new Date(result.heartsState.lastRegenAt).toISOString(),
          });
        }
        return response;
      },
    }),
    onError: (error) => toast.error(error.message || "Failed to send message."),
  })])));
  const { messages, sendMessage, status } = useChat({ chat: chats[activeId], throttle: 50 });
  const isLoading = status === "submitted" || status === "streaming";
  const chatMessages = useMemo(() => messages.map((message) => ({
    id: message.id,
    role: message.role as "user" | "assistant",
    content: message.parts.filter((part) => part.type === "text").map((part) => part.text).join(""),
  })), [messages]);

  return {
    hearts, timeToRegen, refillMinutes,
    chatInput: inputs[activeId] ?? "",
    setChatInput: (value: string) => setInputs((previous) => ({ ...previous, [activeId]: value })),
    chatMessages, isLoading, isStreaming: status === "streaming",
    sendToTutor(text: string) {
      if (!text.trim() || isLoading || submitted || hearts.currentCount <= 0) return;
      void sendMessage({ text }, { body: {
        assignmentId: assignment.id, itemId: activeId, currentCode: code, lastRunResults: runResults,
      } });
      setInputs((previous) => ({ ...previous, [activeId]: "" }));
    },
  };
}
