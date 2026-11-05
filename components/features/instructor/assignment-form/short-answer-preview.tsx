import { Textarea } from "@/components/ui/textarea";
import type { ShortAnswerInput } from "@/lib/items/short-answer";
export function ShortAnswerPreview({ value, index, total }: { value: ShortAnswerInput; index: number; total: number }) {
  return <section className="space-y-3 rounded-[12px] border border-pace-line bg-white p-5">
    <h2 className="font-bold">Student preview</h2>
    <p className="text-[11px] uppercase text-pace-muted">Item {index + 1} of {total} · {value.points} pts</p>
    <h3 className="font-bold">{value.title || "Write an Item prompt"}</h3>
    <Textarea aria-label="Answer preview" disabled placeholder="Type your answer" className="min-h-32 rounded-[12px]" />
    <p className="text-[13px] text-pace-muted">Graded by your Instructor</p>
  </section>;
}
