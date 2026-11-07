"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formControl } from "./form-field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { MultipleChoiceInput } from "@/lib/items/multiple-choice";

export function ChoiceEditor({
  initial,
  locked,
  busy,
  onSave,
  onDelete,
  onPreviewChange,
}: {
  initial: MultipleChoiceInput;
  locked: boolean;
  busy: boolean;
  onSave: (input: MultipleChoiceInput) => void;
  onDelete: () => void;
  onPreviewChange?: (value: MultipleChoiceInput) => void;
}) {
  const [value, setValue] = useState(initial);
  const patch = (change: Partial<MultipleChoiceInput>) => {
    const next = { ...value, ...change };
    setValue(next);
    onPreviewChange?.(next);
  };
  return (
    <section className="space-y-3 bg-white px-4 pb-4 md:pl-[50px]">
      <label className="block space-y-2 text-[13px] font-semibold">
        <span className="block">Question</span>
        <Input
          disabled={busy}
          value={value.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Write an Item prompt"
          className={formControl}
        />
      </label>
      <p className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">
        Options · click the circle to mark the correct answer
      </p>
      <RadioGroup
        aria-label="Correct answer"
        value={String(value.correctOption)}
        disabled={locked || busy}
        onValueChange={(v) => patch({ correctOption: Number(v) })}
        className="gap-3"
      >
        {value.options.map((option, index) => (
          <div
            key={index}
            className={`flex items-center gap-2.5 rounded-[8px] border p-2.5 ${value.correctOption === index ? "border-pace-green bg-pace-green-tint" : "border-pace-line"}`}
          >
            <RadioGroupItem
              value={String(index)}
              aria-label={`Mark option ${index + 1} correct`}
              className="size-5 data-checked:border-pace-green data-checked:bg-pace-green"
            />
            <Input
              aria-label={`Option ${index + 1}`}
              disabled={locked || busy}
              value={option}
              onChange={(e) =>
                patch({
                  options: value.options.map((v, n) =>
                    n === index ? e.target.value : v,
                  ),
                })
              }
              className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] shadow-none"
            />
            {value.correctOption === index && (
              <span className="hidden whitespace-nowrap sm:inline text-[11px] font-bold uppercase text-pace-green-deep">
                Correct answer
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="size-5 shrink-0 text-pace-muted"
              aria-label={`Remove option ${index + 1}`}
              disabled={locked || busy || value.options.length <= 2}
              onClick={() =>
                patch({
                  options: value.options.filter((_, n) => n !== index),
                  correctOption:
                    index === value.correctOption
                      ? -1
                      : value.correctOption -
                        Number(index < value.correctOption),
                })
              }
            >
              ×
            </Button>
          </div>
        ))}
      </RadioGroup>
      <Button
        variant="ghost"
        disabled={locked || busy || value.options.length >= 20}
        onClick={() => patch({ options: [...value.options, ""] })}
      >
        + Add option
      </Button>
      {locked && (
        <p className="text-[13px] text-pace-muted">
          A Student has started. Options and the answer key are locked.
        </p>
      )}
      <div className="flex items-end gap-3">
        <label className="min-w-0 flex-1 block space-y-2 text-[13px] font-semibold">
          <span className="block">Points</span>
          <Input
            disabled={busy}
            aria-label="Points"
            type="number"
            step="any"
            min={0}
            value={value.points}
            onChange={(e) => patch({ points: Number(e.target.value) })}
            className={`${formControl} max-w-[140px]`}
          />
        </label>
        <Button variant="ghost" disabled={locked || busy} onClick={onDelete}>
          Delete
        </Button>
        <Button
          disabled={busy}
          onClick={() => onSave(value)}
          className="h-10 rounded-full bg-pace-green px-[18px] text-white shadow-[0_3px_0_#11923a]"
        >
          {busy ? "Saving…" : "Done"}
        </Button>
      </div>
    </section>
  );
}
