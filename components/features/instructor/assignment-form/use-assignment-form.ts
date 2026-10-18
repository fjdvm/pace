import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAssignment } from "@/app/actions/create-assignment";
import { updateAssignment } from "@/app/actions/update-assignment";
import { decodeLineBreaks, validateAssignment, type AssignmentFormValues, type TestCaseForm } from "@/lib/assignment-form";
import { emptyAssignment, sampleAssignment } from "@/lib/sample-assignment";
import { useAssignmentDraft } from "./use-assignment-draft";

type Options = {
  initial?: AssignmentFormValues;
  assignmentId?: string;
  onlyClassId?: string;
};

export function useAssignmentForm({ initial, assignmentId, onlyClassId }: Options) {
  const router = useRouter();
  const draft = useAssignmentDraft(assignmentId);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<AssignmentFormValues>(() => {
    if (initial) return initial;
    const blank = emptyAssignment();
    return onlyClassId ? { ...blank, classIds: [onlyClassId] } : blank;
  });

  const patch = (change: Partial<AssignmentFormValues>) => setValues((prev) => ({ ...prev, ...change }));

  const toggleClass = (classId: string) =>
    patch({
      classIds: values.classIds.includes(classId)
        ? values.classIds.filter((id) => id !== classId)
        : [...values.classIds, classId],
    });

  const changeTestCase = (index: number, change: Partial<TestCaseForm>) =>
    patch({ testCases: values.testCases.map((tc, i) => (i === index ? { ...tc, ...change } : tc)) });

  const addTestCase = () =>
    patch({ testCases: [...values.testCases, { input: "", expectedOutput: "", visible: true }] });

  const removeTestCase = (index: number) => {
    if (values.testCases.length === 1) {
      toast.error("At least one test case is required");
      return;
    }
    patch({ testCases: values.testCases.filter((_, i) => i !== index) });
  };

  const fillSample = () => {
    patch(sampleAssignment());
    toast.success("Sample assignment filled in");
  };

  const loadDraft = draft.load;
  const restoreDraft = useCallback(() => {
    const saved = loadDraft();
    if (!saved) return;
    setValues(saved);
    toast.success("Draft restored");
  }, [loadDraft]);

  const saveDraft = () => {
    if (draft.save(values)) toast.success("Draft saved on this device");
    else toast.error("Could not save the draft");
  };

  const submit = async () => {
    const problem = validateAssignment(values);
    if (problem) {
      toast.error(problem);
      return;
    }
    setIsSaving(true);
    const payload = {
      ...values,
      testCases: values.testCases.map((tc) => ({
        ...tc,
        input: decodeLineBreaks(tc.input),
        expectedOutput: decodeLineBreaks(tc.expectedOutput),
      })),
    };
    const result = assignmentId
      ? await updateAssignment(assignmentId, payload)
      : await createAssignment(payload);
    setIsSaving(false);
    if (!result.success) {
      toast.error(result.error || "Could not save the assignment");
      return;
    }
    draft.clear();
    toast.success(assignmentId ? "Assignment updated" : "Assignment published");
    router.push("/dashboard/instructor");
    router.refresh();
  };

  return {
    values,
    isSaving,
    patch,
    toggleClass,
    changeTestCase,
    addTestCase,
    removeTestCase,
    fillSample,
    restoreDraft,
    saveDraft,
    submit,
  };
}
