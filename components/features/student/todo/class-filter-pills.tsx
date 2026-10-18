import { cn } from "@/lib/utils";

type ClassFilterPillsProps = {
  classes: { id: string; name: string }[];
  selected: string;
  onChange: (id: string) => void;
};

export function ClassFilterPills({ classes, selected, onChange }: ClassFilterPillsProps) {
  const options = [{ id: "all", name: "All classes" }, ...classes];
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter to-do by class">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold",
            selected === o.id
              ? "bg-pace-ink text-white"
              : "border-[1.5px] border-pace-line-strong bg-white text-pace-ink",
          )}
        >
          {o.name}
        </button>
      ))}
    </div>
  );
}
