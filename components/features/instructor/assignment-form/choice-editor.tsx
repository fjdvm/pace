"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChoiceOptions } from "@/components/features/student/workspace/choice-options";
import type { MultipleChoiceInput } from "@/lib/items/multiple-choice";

export function ChoiceEditor({
  initial,
  locked,
  busy,
  onSave,
  onDelete,
}: {
  initial: MultipleChoiceInput;
  locked: boolean;
  busy: boolean;
  onSave: (input: MultipleChoiceInput) => void;
  onDelete: () => void;
}) {
  const [value, setValue] = useState(initial);
  const patch = (change: Partial<MultipleChoiceInput>) =>
    setValue((prev) => ({ ...prev, ...change }));
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className="space-y-3 rounded-xl border-2 border-pace-green bg-white p-4 lg:p-6">
        <div className="flex items-center justify-between gap-3">
          <b>Multiple choice</b>
          <span className="text-[13px]">{value.points} pts</span>
        </div>
        <label className="block space-y-2 text-[13px] font-semibold">
          <span>Question</span>
          <Input
            value={value.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Write an Item prompt"
            className="h-12 rounded-xl"
          />
        </label>
        <p className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">
          Options · click the circle to mark the correct answer
        </p>
        <RadioGroup
          aria-label="Correct answer"
          value={String(value.correctOption)}
          disabled={locked}
          onValueChange={(v) => patch({ correctOption: Number(v) })}
          className="gap-3"
        >
          {value.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center gap-2.5 rounded-lg border p-2.5 ${value.correctOption === index ? "border-pace-green bg-pace-green-tint" : "border-pace-line"}`}
            >
              <RadioGroupItem
                value={String(index)}
                aria-label={`Mark option ${index + 1} correct`}
                className="size-5 data-checked:border-pace-green data-checked:bg-pace-green"
              />
              <Input
                aria-label={`Option ${index + 1}`}
                disabled={locked}
                value={option}
                onChange={(e) =>
                  patch({
                    options: value.options.map((v, n) =>
                      n === index ? e.target.value : v,
                    ),
                  })
                }
                className="h-auto min-w-0 border-0 bg-transparent p-0 text-[13px] shadow-none"
              />
              {value.correctOption === index && (
                <span className="text-[11px] font-bold uppercase text-pace-green-deep">
                  Correct answer
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remove option ${index + 1}`}
                disabled={locked || value.options.length <= 2}
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
          disabled={locked || value.options.length >= 20}
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
          <label className="min-w-0 flex-1 space-y-2 text-[13px] font-semibold">
            <span>Points</span>
            <Input
              aria-label="Points"
              type="number"
              min={0}
              value={value.points}
              onChange={(e) => patch({ points: Number(e.target.value) })}
              className="h-12 max-w-[140px] rounded-xl"
            />
          </label>
          <Button variant="ghost" disabled={locked || busy} onClick={onDelete}>
            Delete
          </Button>
          <Button
            disabled={busy}
            onClick={() => onSave(value)}
            className="rounded-full bg-pace-green text-white"
          >
            {busy ? "Saving…" : "Done"}
          </Button>
        </div>
      </section>
      <aside className="h-fit space-y-3 rounded-xl border border-pace-line bg-white p-5">
        <b>Student preview</b>
        <p className="text-[11px] uppercase text-pace-muted">
          {value.points} pts
        </p>
        <p className="text-[15px] font-bold">{value.title}</p>
        <ChoiceOptions options={value.options} value="" disabled />
      </aside>
    </div>
  );
}
