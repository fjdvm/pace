import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestCaseForm } from "@/lib/assignment-form";

type TestCaseRowProps = {
  index: number;
  testCase: TestCaseForm;
  disabled: boolean;
  onChange: (index: number, patch: Partial<TestCaseForm>) => void;
  onRemove: (index: number) => void;
};

const field =
  "h-10 w-full min-w-0 rounded-[10px] bg-pace-canvas px-3 font-mono text-xs text-pace-ink outline-none placeholder:text-pace-muted focus:ring-2 focus:ring-pace-ink disabled:opacity-60";

export function TestCaseRow({ index, testCase, disabled, onChange, onRemove }: TestCaseRowProps) {
  return (
    <div className="grid min-w-[520px] grid-cols-[1fr_1fr_8rem_2rem] items-center gap-3">
      <input
        aria-label={`Test case ${index + 1} input`}
        value={testCase.input}
        disabled={disabled}
        onChange={(e) => onChange(index, { input: e.target.value })}
        placeholder="stdin (use \n for new lines)"
        className={field}
      />
      <input
        aria-label={`Test case ${index + 1} expected output`}
        value={testCase.expectedOutput}
        disabled={disabled}
        onChange={(e) => onChange(index, { expectedOutput: e.target.value })}
        placeholder="stdout"
        className={field}
      />
      <button
        type="button"
        role="switch"
        aria-checked={testCase.visible}
        disabled={disabled}
        onClick={() => onChange(index, { visible: !testCase.visible })}
        className="flex cursor-pointer items-center gap-2 text-xs text-pace-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          className={cn(
            "flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
            testCase.visible ? "justify-end bg-pace-green" : "justify-start bg-pace-line-strong",
          )}
        >
          <span className="size-4 rounded-full bg-white shadow" />
        </span>
        {testCase.visible ? "Visible" : "Hidden"}
      </button>
      <button
        type="button"
        aria-label={`Remove test case ${index + 1}`}
        disabled={disabled}
        onClick={() => onRemove(index)}
        className="cursor-pointer text-pace-muted hover:text-pace-red disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
