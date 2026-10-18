import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_HINT_LEVEL } from "@/components/features/student/workspace/hint-levels";
import type { SubmissionDetail } from "./types";

export function TutorChatTab({ chat }: { chat: SubmissionDetail["chat"] }) {
  if (chat.length === 0) {
    return <p className="py-10 text-center text-sm text-pace-muted">This student did not ask the tutor anything.</p>;
  }

  let level = 0;
  return (
    <div className="flex flex-col gap-2.5">
      {chat.map((message, i) => {
        const isTutor = message.role === "assistant";
        if (isTutor) level = Math.min(MAX_HINT_LEVEL, level + 1);
        return (
          <div key={i} className={cn("flex flex-col gap-1", isTutor ? "items-start" : "items-end")}>
            {isTutor && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-pace-purple">
                <Sparkles className="size-3" />
                Hint level {level}
              </span>
            )}
            <div
              className={cn(
                "max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed text-pace-ink [&_p]:my-1 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-white/60 [&_pre]:p-2 [&_code]:text-xs",
                isTutor ? "bg-pace-purple-tint" : "bg-pace-sunken",
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          </div>
        );
      })}
    </div>
  );
}
