import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IMPORT_LANGUAGES, type ImportSettings } from "@/lib/ai-import/types";

const KINDS = [
  { value: "auto", label: "Auto-detect (coding + quiz)" },
  { value: "coding", label: "Coding only" },
  { value: "multiple_choice", label: "Multiple choice only" },
  { value: "short_answer", label: "Short answer only" },
];

type Props = { value: ImportSettings; onChange: (next: ImportSettings) => void };

export function ImportSettingsFields({ value, onChange }: Props) {
  return (
    <>
      <p className="text-base font-bold tracking-[-.08px]">Settings for the draft</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-[13px] font-semibold">Activity type</Label>
          <Select value={value.kinds} onValueChange={(kinds) => onChange({ ...value, kinds: kinds as ImportSettings["kinds"] })}>
            <SelectTrigger aria-label="Activity type" className="data-[size=default]:h-12 w-full rounded-[12px] border-[1.5px] border-pace-line-strong bg-white px-4"><SelectValue>{KINDS.find((k) => k.value === value.kinds)?.label}</SelectValue></SelectTrigger>
            <SelectContent>{KINDS.map((k) => <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[13px] font-semibold">Language</Label>
          <Select value={value.language} onValueChange={(language) => onChange({ ...value, language: language ?? "Python" })}>
            <SelectTrigger aria-label="Language" className="data-[size=default]:h-12 w-full rounded-[12px] border-[1.5px] border-pace-line-strong bg-white px-4"><SelectValue>{value.language}</SelectValue></SelectTrigger>
            <SelectContent>{IMPORT_LANGUAGES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <Toggle title="Write test cases for coding items" hint="AI adds visible and hidden tests from the examples" checked={value.writeTests} onChange={(writeTests) => onChange({ ...value, writeTests })} />
      <Toggle title="Detect answer keys" hint="Use marked answers in the file for quiz items" checked={value.detectKeys} onChange={(detectKeys) => onChange({ ...value, detectKeys })} />
    </>
  );
}

function Toggle({ title, hint, checked, onChange }: { title: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-[15px] leading-[1.55]">{title}</p>
        <p className="text-[13px] text-pace-muted">{hint}</p>
      </div>
      <Switch className="data-[size=default]:h-6 data-[size=default]:w-10 [&_[data-slot=switch-thumb]]:size-5! [&_[data-slot=switch-thumb]]:data-checked:translate-x-4!" checked={checked} onCheckedChange={onChange} aria-label={title} />
    </div>
  );
}
