"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "@/components/features/assignments/workspace-chat/chat-bubble";
import { hintLevelForMessage, hintLevelName } from "./hint-levels";

type TutorMessagesProps = {
  messages: (ChatMessage & { hintLevel?: number })[];
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
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4 pt-2 lg:pt-4 select-text">
      {visible.length === 0 && (
        <p className="max-w-[274px] rounded-[12px] bg-pace-purple-tint px-3 py-2.5 text-[13px] leading-normal text-pace-ink">
          Hi! I can explain your code, point to where an error might be, and give hints. I won&apos;t write the solution for you. Each question uses one heart.
        </p>
      )}
      {visible.map((m, i) => {
        const hintCount = hintLevelForMessage(visible, i);
        if (m.role === "user") {
          return (
            <div key={m.id || i} className="flex shrink-0 justify-end lg:justify-start">
              <p className="w-[294px] max-w-full whitespace-pre-wrap rounded-[12px] bg-pace-sunken px-3 lg:w-[274px] py-2.5 text-[13px] leading-normal text-pace-ink">
                {m.content}
              </p>
            </div>
          );
        }
        return (
          <div key={m.id || i} className="flex w-[294px] max-w-full shrink-0 flex-col gap-1.5 rounded-[12px] bg-pace-purple-tint px-3 py-2.5 lg:w-[274px]">
            <span className="text-[11px] font-bold uppercase leading-[1.3] tracking-[0.66px] text-pace-purple">
              Hint level {hintCount} · {hintLevelName(hintCount)}
            </span>
            <div className="text-[13px] leading-normal text-pace-ink break-words [&_code]:rounded [&_code]:bg-white/70 [&_code]:px-1 [&_p]:my-1 [&_pre]:overflow-x-auto [&_pre]:rounded-[8px] [&_pre]:bg-white/70 [&_pre]:p-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
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
