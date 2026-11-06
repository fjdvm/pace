import { FanCardShell } from "../fan-card-shell";

const posts = [
  { label: "New activity: Lab 2", dot: "bg-[#22c55e]" },
  { label: "Quiz 1 · 3 items", dot: "bg-[#8b5cf6]" },
  { label: "Lab 1 returned", dot: "bg-[#3b82f6]" },
];

export function ActivityCard() {
  return (
    <FanCardShell prompt="Post an activity to your class.">
      {posts.map(({ label, dot }) => (
        <div
          key={label}
          className="flex w-full items-center gap-[6px] rounded-lg bg-[#f4f4f2] px-2 py-[7px]"
        >
          <span className={`size-3 shrink-0 rounded-full ${dot}`} />
          <span className="whitespace-nowrap font-lp-sans text-[9px] font-semibold text-lp-ink">
            {label}
          </span>
        </div>
      ))}
    </FanCardShell>
  );
}
