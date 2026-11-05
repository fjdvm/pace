import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { paceButtonBase, paceButtonStyles } from "@/components/features/student/shared/pace-button";
import type { ImportedItem } from "@/lib/ai-import/types";

type Props = { item: ImportedItem; onChange: (patch: Partial<ImportedItem>) => void };

export function CodingBody({ item, onChange }: Props) {
  const tests = item.testCases;
  const setTest = (i: number, patch: Partial<(typeof tests)[number]>) =>
    onChange({ testCases: tests.map((t, n) => (n === i ? { ...t, ...patch } : t)) });
  const fromAi = tests.filter((t) => t.fromAi).length;
  return (
    <>
      <Textarea value={item.instructions} onChange={(e) => onChange({ instructions: e.target.value })} aria-label="Instructions" className="min-h-20 text-[15px]" />
      <p className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">
        Test cases · {tests.length - fromAi} from the file, {fromAi} written by AI
      </p>
      <div className="overflow-hidden rounded-[8px] border border-pace-line">
        <div className="grid grid-cols-[1fr_1fr_90px_32px] gap-2 bg-pace-sunken px-3 py-2 text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">
          <span>Input</span><span>Expected output</span><span>Visible</span><span />
        </div>
        {tests.map((t, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_90px_32px] items-center gap-2 border-t border-pace-line px-3 py-2">
            <Input value={t.input} onChange={(e) => setTest(i, { input: e.target.value })} aria-label={`Test ${i + 1} input`} className="h-8 font-mono text-[13px]" />
            <Input value={t.expectedOutput} onChange={(e) => setTest(i, { expectedOutput: e.target.value })} aria-label={`Test ${i + 1} output`} className="h-8 font-mono text-[13px]" />
            <Switch size="sm" checked={t.visible} onCheckedChange={(visible) => setTest(i, { visible })} aria-label={`Test ${i + 1} visible`} />
            <button type="button" aria-label={`Remove test ${i + 1}`} onClick={() => onChange({ testCases: tests.filter((_, n) => n !== i) })} className="text-pace-muted">✕</button>
          </div>
        ))}
      </div>
      <Button type="button" variant="ghost" onClick={() => onChange({ testCases: [...tests, { input: "", expectedOutput: "", visible: false, fromAi: false }] })} className={`${paceButtonBase} ${paceButtonStyles.ghost} w-fit`}>+ Add test</Button>
    </>
  );
}
