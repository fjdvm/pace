import type {
  WorkspaceViewProps,
  WorkspaceItem,
  TestRunResult,
} from "@/components/features/assignments/types";
export function workspaceItems(props: WorkspaceViewProps): WorkspaceItem[] {
  if (props.items) return props.items;
  const { assignment } = props;
  return [
    {
      id: assignment.id,
      title: assignment.title,
      instructions: assignment.instructions,
      language: assignment.language,
      starterCode: "",
      points: 100,
      testCases: props.visibleTestCases,
      hiddenTestCount: props.hiddenTestCount,
      code: props.initialSubmission?.code ?? props.initialDraftCode,
      testResults: props.initialSubmission?.testResults as
        TestRunResult[] | null,
    },
  ];
}
