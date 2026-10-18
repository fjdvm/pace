import { cn } from "@/lib/utils";

type PaceTextFieldProps = React.ComponentProps<"input"> & {
  label: string;
  hint?: string;
};

export function PaceTextField({ label, hint, className, id, ...props }: PaceTextFieldProps) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-[13px] font-semibold text-pace-ink">
        {label}
      </label>
      <input
        id={fieldId}
        className={cn(
          "h-11 w-full rounded-xl border-[1.5px] border-pace-line bg-white px-3.5 text-sm text-pace-ink outline-none placeholder:text-pace-muted focus:border-pace-ink",
          className,
        )}
        {...props}
      />
      {hint && <p className="text-xs text-pace-muted">{hint}</p>}
    </div>
  );
}
