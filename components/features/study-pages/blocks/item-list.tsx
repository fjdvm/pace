import { cn } from "@/lib/utils";

export type ListItem = string | { lead: string; lines: string[] };

export function ItemList({ items, ordered }: { items: ListItem[]; ordered?: boolean }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={typeof item === "string" ? item : item.lead} className="flex items-start gap-3.5">
          {ordered ? (
            <span className="rounded-full bg-lp-canvas px-[9px] py-[3px] text-[13px] font-semibold text-lp-ink">{index + 1}</span>
          ) : (
            <span aria-hidden className="text-[17px] font-semibold leading-normal text-lp-ink">•</span>
          )}
          {typeof item === "string" ? (
            <p className="min-w-0 flex-1 text-[17px] leading-[27px] text-[#3d3d3d]">{item}</p>
          ) : (
            <div className={cn("flex min-w-0 flex-1 flex-col gap-1.5")}>
              <p className="text-[17px] font-medium leading-[27px] text-lp-ink">{item.lead}</p>
              {item.lines.map((line) => (
                <p key={line} className="text-base leading-[25px] text-[#3d3d3d]">{line}</p>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
