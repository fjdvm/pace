"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import type { ChatMessage } from "@/components/features/assignments/workspace-chat/chat-bubble";
import { MAX_HINT_LEVEL } from "./hint-levels";

type TutorMessagesProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  children?: React.ReactNode;
};

export function TutorMessages({ messages, isLoading, isStreaming, children }: TutorMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const visible = messages.filter((m) => m.content.trim() !== "" || !isLoading);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming, children]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 select-text">
      {visible.length === 0 && (
        <p className="max-w-[274px] rounded-[12px] bg-pace-purple-tint px-3 py-2.5 text-[13px] leading-normal text-pace-ink">
          Hi! I can explain your code, point to where an error might be, and give hints. I won&apos;t write the solution for you. Each question uses one heart.
        </p>
      )}
      {visible.map((m, i) => {
        const hintCount = visible.slice(0, i + 1).filter((x) => x.role === "assistant").length;
        if (m.role === "user") {
          return (
            <div key={m.id || i} className="flex justify-end">
              <p className="max-w-[90%] whitespace-pre-wrap rounded-[12px] bg-pace-sunken px-3.5 py-2.5 text-[13px] leading-normal text-pace-ink">
                {m.content}
              </p>
            </div>
          );
        }
        return (
          <div key={m.id || i} className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[13px] leading-normal text-pace-purple">
              <PaceIcon name="workspace/sparkles-12" size={12} />
              Hint level {Math.min(hintCount, MAX_HINT_LEVEL)}
            </span>
            <div className="rounded-[16px] bg-pace-purple-tint px-3.5 py-3 text-[13px] leading-normal text-pace-ink break-words [&_code]:rounded [&_code]:bg-white/70 [&_code]:px-1 [&_p]:my-1 [&_pre]:overflow-x-auto [&_pre]:rounded-[8px] [&_pre]:bg-white/70 [&_pre]:p-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
            </div>
          </div>
        );
      })}
      {isLoading && !isStreaming && (
        <p className="animate-pulse text-[13px] text-pace-purple">Thinking…</p>
      )}
      {children}
      <div ref={bottomRef} />
    </div>
  );
}
