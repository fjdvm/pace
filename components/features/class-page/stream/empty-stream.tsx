import { MessagesSquare } from "lucide-react";

export function EmptyStream() {
  return (
    <div className="flex items-center gap-8 rounded-lg border border-pace-line-strong bg-white px-8 py-10">
      <MessagesSquare className="size-24 shrink-0 text-pace-line-strong" strokeWidth={1} />
      <div className="flex flex-col gap-1">
        <p className="text-[22px] leading-tight text-pace-ink">This is where you&rsquo;ll see updates for this class</p>
        <p className="text-sm font-bold text-pace-ink">Use the stream to connect with your class and check for announcements</p>
      </div>
    </div>
  );
}
