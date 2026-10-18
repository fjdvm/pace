"use client";

import { useEffect } from "react";
import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { PaceActionButton } from "@/components/features/student/shared/pace-action-button";
import { DeleteAssignmentDialog } from "@/components/features/submissions/delete-assignment-dialog";
import { useAssignmentActions } from "@/components/features/dashboard/instructor/components/use-assignment-actions";
import { buildChecklist, type AssignmentFormValues } from "@/lib/assignment-form";
import { splitClassName } from "@/lib/class-name";
import type { InstructorClassSummary } from "@/components/features/instructor/types";
import { useAssignmentForm } from "./use-assignment-form";
import { DetailsSection } from "./details-section";
import { TestCasesSection } from "./test-cases-section";
import { TutorSection } from "./tutor-section";
import { ClassesSection } from "./classes-section";
import { PublishPanel } from "./publish-panel";

type AssignmentFormViewProps = {
  classes: InstructorClassSummary[];
  initial?: AssignmentFormValues;
  assignmentId?: string;
  locked?: boolean;
};

export function AssignmentFormView({ classes, initial, assignmentId, locked = false }: AssignmentFormViewProps) {
  const isEditing = !!assignmentId;
  const form = useAssignmentForm({
    initial,
    assignmentId,
    onlyClassId: classes.length === 1 ? classes[0].id : undefined,
  });
  const { restoreDraft } = form;
  const remove = useAssignmentActions();

  useEffect(() => {
    if (!isEditing) restoreDraft();
  }, [isEditing, restoreDraft]);

  const classCodes = classes
    .filter((c) => form.values.classIds.includes(c.id))
    .map((c) => splitClassName(c.name).code);

  return (
    <>
      <StudentTopBar
        title={isEditing ? "Edit assignment" : "New assignment"}
        subtitle={isEditing ? "Changes apply to every class it is assigned to" : "Students see it as soon as you publish"}
        backHref="/dashboard/instructor"
        actions={
          <div className="flex items-center gap-2">
            {isEditing ? (
              <PaceActionButton
                variant="ghost"
                className="text-pace-red"
                onClick={() => remove.requestDelete({ id: assignmentId, title: form.values.title })}
              >
                Delete
              </PaceActionButton>
            ) : (
              <PaceActionButton variant="ghost" onClick={form.saveDraft}>
                Save draft
              </PaceActionButton>
            )}
            <PaceActionButton disabled={form.isSaving} onClick={form.submit}>
              {isEditing ? "Save" : "Publish"}
            </PaceActionButton>
          </div>
        }
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:px-10 md:py-8 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <DetailsSection values={form.values} onChange={form.patch} />
          <TestCasesSection
            testCases={form.values.testCases}
            locked={locked}
            onChange={form.changeTestCase}
            onAdd={form.addTestCase}
            onRemove={form.removeTestCase}
          />
          <TutorSection values={form.values} onChange={form.patch} />
          <ClassesSection classes={classes} selected={form.values.classIds} onToggle={form.toggleClass} />
        </div>
        <PublishPanel
          checklist={buildChecklist(form.values, classCodes)}
          classCodes={classCodes}
          isEditing={isEditing}
          isSaving={form.isSaving}
          onPublish={form.submit}
          onFillSample={form.fillSample}
        />
      </main>
      <DeleteAssignmentDialog
        open={!!remove.pendingDelete}
        onOpenChange={(open) => {
          if (!open) remove.cancelDelete();
        }}
        onConfirm={remove.confirmDelete}
        assignmentTitle={remove.pendingDelete?.title ?? ""}
        isDeleting={remove.isDeleting}
      />
    </>
  );
}
