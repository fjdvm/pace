"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES, decodeLineBreaks, encodeLineBreaks, type AssignmentFormValues } from "@/lib/assignment-form";
import { emptyAssignment } from "@/lib/sample-assignment";
import type { CodingItemInput } from "@/lib/items/input";
import { DetailsSection } from "./details-section";
import { StarterCodeSection } from "./starter-code-section";
import { CodingTests } from "./coding-tests";
import { FormField, formControl } from "./form-field";

type Props = {
  initial?: CodingItemInput;
  classId?: string;
  itemNumber: number;
  locked: boolean;
  busy: boolean;
  isDraft?: boolean;
  onSave: (input: CodingItemInput, close?: boolean) => Promise<unknown>;
  onDelete: () => void;
};

export function CodingItemEditor({ initial, classId, itemNumber, locked, busy, isDraft, onSave, onDelete }: Props) {
  const [values, setValues] = useState<AssignmentFormValues>(() => ({
    ...emptyAssignment(), title: initial?.title ?? "", instructions: initial?.instructions ?? "",
    language: initial?.language ?? "Python", points: initial?.points ?? 10, starterCode: initial?.starterCode ?? "",
    testCases: initial?.testCases?.map((test) => ({ ...test, input: encodeLineBreaks(test.input), expectedOutput: encodeLineBreaks(test.expectedOutput) })) ?? [{ input: "", expectedOutput: "", visible: true }],
  }));
  const patch = (change: Partial<AssignmentFormValues>) => setValues((prev) => ({ ...prev, ...change }));
  const input: CodingItemInput = {
    kind: "coding", title: values.title, instructions: values.instructions, language: values.language,
    starterCode: values.starterCode, points: values.points ?? 10,
    ...(!locked ? { testCases: values.testCases.map((test) => ({ ...test, input: decodeLineBreaks(test.input), expectedOutput: decodeLineBreaks(test.expectedOutput) })) } : {}),
  };
  const signature = JSON.stringify(input);
  const attempted = useRef(signature);
  const [saved, setSaved] = useState<string | undefined>(initial ? signature : undefined);
  useEffect(() => {
    if (!isDraft || busy || attempted.current === signature || !input.title.trim() || !input.instructions.trim() || !Number.isFinite(input.points)) return;
    const timer = window.setTimeout(async () => {
      attempted.current = signature;
      if (await onSave(input, false)) setSaved(signature);
    }, 1200);
    return () => window.clearTimeout(timer);
  });
  return (
    <div className="space-y-4">
      <DetailsSection itemNumber={itemNumber} values={values} onTitleChange={(title) => patch({ title })} onInstructionsChange={(instructions) => patch({ instructions })} />
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-pace-line bg-white p-6">
        <FormField label="Item points" htmlFor="coding-item-points"><Input id="coding-item-points" type="number" min={0} value={values.points} onChange={(event) => patch({ points: event.target.valueAsNumber })} className={formControl} /></FormField>
        <FormField label="Language" htmlFor="coding-item-language">
          <Select value={values.language} disabled={locked} onValueChange={(language) => { if (language) patch({ language }); }}>
            <SelectTrigger id="coding-item-language" className={formControl}><SelectValue /></SelectTrigger>
            <SelectContent>{LANGUAGES.map((language) => <SelectItem key={language} value={language}>{language}</SelectItem>)}</SelectContent>
          </Select>
        </FormField>
      </div>
      <StarterCodeSection values={values} locked={locked} onChange={patch} />
      <CodingTests language={values.language} classId={classId} testCases={values.testCases} points={values.points ?? 10} locked={locked}
        onChange={(index, change) => patch({ testCases: values.testCases.map((test, i) => i === index ? { ...test, ...change } : test) })}
        onAdd={() => patch({ testCases: [...values.testCases, { input: "", expectedOutput: "", visible: true }] })}
        onRemove={(index) => patch({ testCases: values.testCases.filter((_, i) => i !== index) })} />
      <div className="flex flex-wrap items-center gap-3">
        {isDraft && saved === signature && <span role="status" className="text-xs text-pace-muted">Draft saved</span>}
        <Button disabled={busy} onClick={() => onSave(input, true)}>Done</Button>
        <Button variant="outline" disabled={busy || locked} onClick={onDelete}>Delete Item</Button>
      </div>
    </div>
  );
}
