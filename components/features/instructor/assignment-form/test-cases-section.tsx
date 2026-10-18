import { Lock, Plus } from "lucide-react";
import type { TestCaseForm } from "@/lib/assignment-form";
import { FormSection } from "./form-section";
import { TestCaseRow } from "./test-case-row";

type TestCasesSectionProps = {
  testCases: TestCaseForm[];
  locked: boolean;
  onChange: (index: number, patch: Partial<TestCaseForm>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

const heading = "text-[11px] font-bold uppercase tracking-[0.06em] text-pace-muted";

export function TestCasesSection({ testCases, locked, onChange, onAdd, onRemove }: TestCasesSectionProps) {
  return (
    <FormSection
      step={2}
      title="Test cases"
      subtitle="Visible tests help students check their work. Hidden tests run only on submit."
    >
      {locked && (
        <p className="flex items-center gap-2 rounded-xl bg-pace-amber-tint px-3.5 py-2.5 text-xs text-pace-ink">
          <Lock className="size-3.5 shrink-0" />
          Students have already submitted, so test cases are locked to keep scores fair.
        </p>
      )}
      <div className="overflow-x-auto">
        <div className="flex flex-col gap-3">
          <div className="grid min-w-[520px] grid-cols-[1fr_1fr_8rem_2rem] gap-3">
            <span className={heading}>Input (stdin)</span>
            <span className={heading}>Expected output</span>
            <span className={heading}>Visible to students</span>
            <span />
          </div>
          {testCases.map((testCase, index) => (
            <TestCaseRow
              key={index}
              index={index}
              testCase={testCase}
              disabled={locked}
              onChange={onChange}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
      {!locked && (
        <button
          type="button"
          onClick={onAdd}
          className="flex w-fit cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-pace-green-deep"
        >
          <Plus className="size-4" />
          Add test case
        </button>
      )}
    </FormSection>
  );
}
