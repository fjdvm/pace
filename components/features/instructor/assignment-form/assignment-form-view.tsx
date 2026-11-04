"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DeleteAssignmentDialog } from "@/components/features/submissions/delete-assignment-dialog";
import { useAssignmentActions } from "@/components/features/dashboard/instructor/components/use-assignment-actions";
import type { AssignmentFormValues } from "@/lib/assignment-form";
import type { InstructorClassSummary } from "@/components/features/instructor/types";
import { useAssignmentForm } from "./use-assignment-form";
import { DetailsSection } from "./details-section";
import { FormHeader } from "./form-header";
import { PostSettings } from "./post-settings";
import { MonitoringSettings } from "./monitoring-settings";
import { ItemsSummary } from "./items-summary";
import { StarterCodeSection } from "./starter-code-section";
import { CodingTests } from "./coding-tests";
import { MobilePostForm } from "./mobile-post-form";
import { PostPreview } from "./post-preview";

type Props = {
  classes: InstructorClassSummary[];
  initial?: AssignmentFormValues;
  assignmentId?: string;
  locked?: boolean;
  defaultClassId?: string;
  initialSavedAt?: string;
};

export function AssignmentFormView({
  classes,
  initial,
  assignmentId,
  locked = false,
  defaultClassId,
  initialSavedAt,
}: Props) {
  const form = useAssignmentForm({
    initial,
    initialSavedAt,
    assignmentId,
    onlyClassId:
      defaultClassId ?? (classes.length === 1 ? classes[0].id : undefined),
  });
  const desktop = useMediaQuery("(min-width: 768px)");
  const [preview, setPreview] = useState(false);
  const remove = useAssignmentActions();
  const router = useRouter();
  const backHref = form.values.classIds[0]
    ? `/dashboard/classes/${form.values.classIds[0]}?tab=classwork`
    : "/dashboard";
  const requestDelete = form.id
    ? () => remove.requestDelete({ id: form.id!, title: form.values.title })
    : undefined;
  return (
    <div className="flex min-h-svh flex-col bg-pace-canvas text-pace-ink">
      <FormHeader
        values={form.values}
        backHref={backHref}
        savedAt={form.savedAt}
        dirty={form.dirty}
        busy={form.isSaving}
        onChange={form.patch}
        onSave={form.saveDraft}
        onAssign={form.submit}
        onPreview={() => setPreview(true)}
        onDelete={requestDelete}
      />
      {desktop ? (
        <div className="flex flex-1 items-stretch">
          <main className="flex min-w-0 flex-1 flex-col gap-5 px-10 py-8">
            <ItemsSummary values={form.values} />
            <DetailsSection
              values={form.values}
              onTitleChange={form.changeTitle}
              onInstructionsChange={form.changeInstructions}
            />
            <StarterCodeSection
              values={form.values}
              locked={locked}
              onChange={form.patch}
            />
            <CodingTests
              testCases={form.values.testCases}
              points={form.values.points ?? 100}
              locked={locked}
              onChange={form.changeTestCase}
              onAdd={form.addTestCase}
              onRemove={form.removeTestCase}
            />
          </main>
          <aside className="flex w-[300px] shrink-0 flex-col gap-4 border-l border-pace-line bg-white px-6 py-8 xl:w-[380px]">
            <PostSettings
              values={form.values}
              classes={classes}
              locked={locked}
              onChange={form.patch}
            />
            <MonitoringSettings />
          </aside>
        </div>
      ) : (
        <MobilePostForm
          form={form}
          classes={classes}
          locked={locked}
          onDelete={requestDelete}
        />
      )}
      <PostPreview
        values={form.values}
        open={preview}
        onOpenChange={setPreview}
      />
      <DeleteAssignmentDialog
        open={!!remove.pendingDelete}
        onOpenChange={(open) => {
          if (!open) remove.cancelDelete();
        }}
        onConfirm={async () => {
          if (await remove.confirmDelete()) router.push(backHref);
        }}
        assignmentTitle={remove.pendingDelete?.title ?? ""}
        isDeleting={remove.isDeleting}
      />
    </div>
  );
}
