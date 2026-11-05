import { ChoiceItems } from "./choice-items";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AssignmentFormValues } from "@/lib/assignment-form";
import type { InstructorClassSummary } from "@/components/features/instructor/types";
import type { useAssignmentForm } from "./use-assignment-form";
import { FormField, formControl } from "./form-field";
import { CodingTests } from "./coding-tests";
import { PostSettings } from "./post-settings";
import { MonitoringSettings } from "./monitoring-settings";
import { StarterCodeSection } from "./starter-code-section";

type Props = {
  form: ReturnType<typeof useAssignmentForm>;
  classes: InstructorClassSummary[];
  locked: boolean;
  onDelete?: () => void;
};

export function MobilePostForm({ form, classes, locked, onDelete }: Props) {
  const [panel, setPanel] = useState<"tests" | "settings" | null>(null);
  const { values, patch } = form;
  const visible = values.testCases.filter((test) => test.visible).length;
  const update = (change: Partial<AssignmentFormValues>) => patch(change);
  return (
    <main className="flex flex-1 flex-col gap-3 bg-white px-4 pt-4 pb-8">
      <FormField label="Title" htmlFor="mobile-title">
        <Input
          id="mobile-title"
          value={values.itemTitle ?? values.title}
          onChange={(event) => form.changeTitle(event.target.value)}
          placeholder="Sum of Two Numbers"
          className={formControl}
        />
      </FormField>
      <FormField label="Instructions" htmlFor="mobile-instructions">
        <Textarea
          id="mobile-instructions"
          value={values.itemInstructions ?? values.instructions}
          onChange={(event) => form.changeInstructions(event.target.value)}
          placeholder="Read two integers and print their sum."
          className={`${formControl} h-auto min-h-12 resize-y py-3`}
        />
      </FormField>
      <FormField label="Due" htmlFor="mobile-due">
        <Input
          id="mobile-due"
          type="datetime-local"
          value={values.dueDate}
          onChange={(event) => update({ dueDate: event.target.value })}
          className={formControl}
        />
      </FormField>
      <div className="flex items-center justify-between rounded-[8px] border border-pace-line px-3.5 py-3">
        <div>
          <h2 className="text-[15px] font-bold leading-[1.55]">Test cases</h2>
          <p className="text-[13px] text-pace-muted">
            {visible} visible · {values.testCases.length - visible} hidden
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setPanel("tests")}
          className="h-auto p-0 text-[13px] font-bold text-pace-green-deep"
        >
          Edit
        </Button>
      </div>
      <Button
        variant="ghost"
        onClick={() => setPanel("settings")}
        className="h-auto justify-between rounded-[8px] border border-pace-line px-3.5 py-3 text-left font-normal"
      >
        <div>
          <h2 className="text-[15px] font-bold leading-[1.55]">Hearts</h2>
          <p className="text-[13px] text-pace-muted">
            {values.heartsCount} per student · refill{" "}
            {values.heartsRegenMinutes} min
          </p>
        </div>
        <span className="flex gap-1">
          {Array.from(
            {
              length: Math.min(
                Number.isFinite(values.heartsCount) ? values.heartsCount : 0,
                5,
              ),
            },
            (_, index) => (
              <Image
                key={index}
                src="/post/heart.svg"
                alt=""
                width={18}
                height={18}
              />
            ),
          )}
        </span>
      </Button>
      <div className="py-1">
        <MonitoringSettings mobile />
      </div>
      <ChoiceItems postId={form.id} locked={locked} onEditingChange={form.setItemEditing} />
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
        <Button variant="outline" onClick={() => setPanel("settings")}>
          Post settings &amp; starter code
        </Button>
        {values.isDraft && (
          <Button
            variant="ghost"
            disabled={form.isSaving}
            onClick={form.saveDraft}
          >
            Save draft
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            disabled={form.isSaving}
            onClick={onDelete}
            className="text-pace-red"
          >
            Delete
          </Button>
        )}
        {form.savedAt && !form.dirty && (
          <time
            dateTime={form.savedAt}
            className="text-xs text-pace-muted"
            aria-live="polite"
          >
            Draft saved ·{" "}
            {new Date(form.savedAt).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </time>
        )}
      </div>
      <Dialog
        open={panel !== null}
        onOpenChange={(open) => {
          if (!open) setPanel(null);
        }}
      >
        <DialogContent className="max-h-[90svh] max-w-[calc(100%-24px)] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle>
              {panel === "tests" ? "Test cases" : "Post settings"}
            </DialogTitle>
          </DialogHeader>
          {panel === "tests" ? (
            <CodingTests
              testCases={values.testCases}
              points={values.points ?? 100}
              locked={locked}
              onChange={form.changeTestCase}
              onAdd={form.addTestCase}
              onRemove={form.removeTestCase}
            />
          ) : (
            <>
              <PostSettings
                showPostTitle
                values={values}
                classes={classes}
                locked={locked}
                onChange={patch}
              />
              <StarterCodeSection
                values={values}
                locked={locked}
                onChange={patch}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
