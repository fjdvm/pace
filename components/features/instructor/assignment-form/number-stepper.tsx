import { Minus, Plus } from "lucide-react";

type NumberStepperProps = {
  id: string;
  label: string;
  unit: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  hint: string;
  onChange: (value: number) => void;
};

export function NumberStepper({ id, label, unit, value, min = 1, max = 999, step = 1, hint, onChange }: NumberStepperProps) {
  const clamp = (next: number) => onChange(Math.min(max, Math.max(min, next)));
  const button =
    "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-pace-line-strong text-pace-ink disabled:opacity-40";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-pace-ink">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-pace-line px-2 py-1.5">
        <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => clamp(value - step)} className={button}>
          <Minus className="size-3.5" />
        </button>
        <div className="flex flex-1 items-baseline justify-center gap-1.5">
          <input
            id={id}
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => clamp(parseInt(e.target.value, 10) || min)}
            className="w-14 bg-transparent text-center text-xl font-bold text-pace-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-xs text-pace-muted">{unit}</span>
        </div>
        <button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => clamp(value + step)} className={button}>
          <Plus className="size-3.5" />
        </button>
      </div>
      <p className="text-xs text-pace-muted">{hint}</p>
    </div>
  );
}
