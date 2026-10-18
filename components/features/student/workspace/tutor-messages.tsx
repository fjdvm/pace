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
  let hintCount = 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming, children]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-5 pb-3 pt-[18px] select-text">
      {visible.length === 0 && !children && (
        <p className="m-auto max-w-[240px] text-center text-[13px] leading-normal text-pace-muted">
          Stuck? Ask the tutor. Hints get more specific each time you ask.
        </p>
      )}
      {visible.map((m, i) => {
        if (m.role === "user") {
          return (
            <div key={m.id || i} className="flex justify-end">
              <p className="max-w-[90%] whitespace-pre-wrap rounded-2xl bg-pace-ink px-3.5 py-2.5 text-[13px] leading-normal text-white">
                {m.content}
              </p>
            </div>
          );
        }
        hintCount += 1;
        return (
          <div key={m.id || i} className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[13px] leading-normal text-pace-purple">
              <PaceIcon name="workspace/sparkles-12" size={12} />
              Hint level {Math.min(hintCount, MAX_HINT_LEVEL)}
            </span>
            <div className="rounded-2xl bg-pace-purple-tint px-3.5 py-3 text-[13px] leading-normal text-pace-ink break-words [&_code]:rounded [&_code]:bg-white/70 [&_code]:px-1 [&_p]:my-1 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-white/70 [&_pre]:p-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
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
