import type { useAssignmentForm } from "./use-assignment-form";
import { DetailsSection } from "./details-section";
import { StarterCodeSection } from "./starter-code-section";
import { CodingTests } from "./coding-tests";

export function PrimaryCodingEditor({ form, locked }: { form: ReturnType<typeof useAssignmentForm>; locked: boolean }) {
  return (
    <>
      <DetailsSection values={form.values} onTitleChange={form.changeTitle} onInstructionsChange={form.changeInstructions} />
      <StarterCodeSection values={form.values} locked={locked} onChange={form.patch} />
      <CodingTests language={form.values.language} classId={form.values.classIds[0]} testCases={form.values.testCases} points={form.values.points ?? 100} locked={locked} onChange={form.changeTestCase} onAdd={form.addTestCase} onRemove={form.removeTestCase} />
    </>
  );
}
