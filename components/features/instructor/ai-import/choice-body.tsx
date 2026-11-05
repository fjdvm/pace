import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ImportedItem } from "@/lib/ai-import/types";

type Props = { item: ImportedItem; onChange: (patch: Partial<ImportedItem>) => void };

export function ChoiceBody({ item, onChange }: Props) {
  const setOption = (i: number, value: string) => onChange({ options: item.options.map((o, n) => (n === i ? value : o)) });
  const removeOption = (i: number) =>
    onChange({ options: item.options.filter((_, n) => n !== i), correctOption: Math.max(0, item.correctOption - (i <= item.correctOption ? 1 : 0)) });
  return (
    <>
      {item.options.map((option, i) => {
        const correct = i === item.correctOption;
        return (
          <div key={i} className={`flex items-center gap-2.5 rounded-[8px] border p-2.5 ${correct ? "border-pace-green bg-pace-green-tint" : "border-pace-line"}`}>
            <button type="button" role="radio" aria-checked={correct} aria-label={`Mark option ${i + 1} correct`} onClick={() => onChange({ correctOption: i })} className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${correct ? "bg-pace-green" : "border-2 border-pace-line-strong bg-white"}`}>{correct ? "✓" : ""}</button>
            <Input value={option} onChange={(e) => setOption(i, e.target.value)} aria-label={`Option ${i + 1}`} className="h-8 flex-1 border-0 bg-transparent px-1 text-[13px] shadow-none" />
            {correct && <span className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-green-deep">Correct answer</span>}
            {item.options.length > 2 && <button type="button" aria-label={`Remove option ${i + 1}`} onClick={() => removeOption(i)} className="text-pace-muted">✕</button>}
          </div>
        );
      })}
      {item.options.length < 20 && <Button type="button" variant="ghost" onClick={() => onChange({ options: [...item.options, ""] })} className="w-fit font-bold">+ Add option</Button>}
    </>
  );
}
