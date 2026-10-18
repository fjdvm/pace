import { cn } from "@/lib/utils";
import { splitClassName } from "@/lib/class-name";

type ClassCodePillsProps = {
  classes: { id: string; name: string }[];
  selected: string;
  onChange: (id: string) => void;
};

export function ClassCodePills({ classes, selected, onChange }: ClassCodePillsProps) {
  const options = [{ id: "all", label: "All" }, ...classes.map((c) => ({ id: c.id, label: splitClassName(c.name).code }))];
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by class">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-semibold",
            selected === o.id ? "bg-pace-ink text-white" : "border-[1.5px] border-pace-line-strong bg-white text-pace-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
