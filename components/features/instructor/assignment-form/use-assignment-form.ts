import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAssignment } from "@/app/actions/create-assignment";
import { updateAssignment } from "@/app/actions/update-assignment";
import {
  decodeLineBreaks,
  codingItemTitlePatch,
  validateAssignment,
  type AssignmentFormValues,
  type TestCaseForm,
} from "@/lib/assignment-form";
import { emptyAssignment } from "@/lib/sample-assignment";

type Options = {
  initial?: AssignmentFormValues;
  assignmentId?: string;
  initialSavedAt?: string;
  onlyClassId?: string;
};

export function useAssignmentForm({
  initial,
  initialSavedAt,
  assignmentId,
  onlyClassId,
}: Options) {
  const router = useRouter();
  const busy = useRef(false);
  const revision = useRef(0);
  const [id, setId] = useState(assignmentId);
  const [itemEditing, setItemEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | undefined>(initialSavedAt);
  const [dirty, setDirty] = useState(false);
  const [values, setValues] = useState<AssignmentFormValues>(
    () =>
      initial ?? {
        ...emptyAssignment(),
        isDraft: true,
        label: "Activity",
        points: 100,
        starterCode: "",
        classIds: onlyClassId ? [onlyClassId] : [],
      },
  );
  const patch = (change: Partial<AssignmentFormValues>) => {
    revision.current += 1;
    setDirty(true);
    setValues((prev) => ({ ...prev, ...change }));
  };
  const changeTestCase = (index: number, change: Partial<TestCaseForm>) =>
    patch({
      testCases: values.testCases.map((tc, i) =>
        i === index ? { ...tc, ...change } : tc,
      ),
    });
  const addTestCase = () =>
    patch({
      testCases: [
        ...values.testCases,
        { input: "", expectedOutput: "", visible: true },
      ],
    });
  const removeTestCase = (index: number) => {
    if (values.testCases.length === 1)
      return toast.error("A coding Item needs at least one test case");
    patch({ testCases: values.testCases.filter((_, i) => i !== index) });
  };
  const persist = async (isDraft: boolean) => {
    if (busy.current) return;
    if (itemEditing) return toast.error("Finish editing the Item with Done before saving or assigning the Post");
    const payload = {
      ...values,
      isDraft,
      testCases: values.testCases.map((tc) => ({
        ...tc,
        input: decodeLineBreaks(tc.input),
        expectedOutput: decodeLineBreaks(tc.expectedOutput),
      })),
    };
    const problem = validateAssignment(payload);
    if (problem) return toast.error(problem);
    const savingRevision = revision.current;
    busy.current = true;
    setIsSaving(true);
    try {
      const result = id
        ? await updateAssignment(id, payload)
        : await createAssignment(payload);
      if (!result.success)
        return toast.error(result.error || "Could not save Post");
      const savedId = "assignment" in result ? result.assignment?.id : id;
      setId(savedId);
      setDirty(revision.current !== savingRevision);
      setSavedAt(new Date().toISOString());
      setValues((prev) => ({ ...prev, isDraft }));
      if (isDraft) {
        if (!id && savedId)
          window.history.replaceState(
            null,
            "",
            `/dashboard/assignments/${savedId}/edit`,
          );
        toast.success("Draft saved");
      } else if (revision.current !== savingRevision) {
        toast.success("Post saved. You have additional unsaved changes.");
      } else {
        toast.success(values.isDraft ? "Post assigned" : "Post updated");
        router.push(
          values.classIds[0]
            ? `/dashboard/classes/${values.classIds[0]}?tab=classwork`
            : "/dashboard",
        );
        router.refresh();
      }
    } catch {
      toast.error("Could not save Post. Please try again.");
    } finally {
      busy.current = false;
      setIsSaving(false);
    }
  };
  return {
    values,
    id,
    dirty,
    savedAt,
    isSaving,
    setItemEditing,
    patch,
    changeTitle: (title: string) => patch(codingItemTitlePatch(values, title)),
    changeInstructions: (instructions: string) =>
      patch({ instructions, itemInstructions: instructions }),
    changeTestCase,
    addTestCase,
    removeTestCase,
    saveDraft: () => persist(true),
    submit: () => persist(false),
  };
}
