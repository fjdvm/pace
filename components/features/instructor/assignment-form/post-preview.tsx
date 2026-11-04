import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AssignmentFormValues } from "@/lib/assignment-form";

export function PostPreview({
  values,
  open,
  onOpenChange,
}: {
  values: AssignmentFormValues;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{values.title || "Untitled Post"}</DialogTitle>
          <DialogDescription>
            {values.label} · {values.language} · {values.points ?? 100} points
          </DialogDescription>
        </DialogHeader>
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
          {values.itemInstructions ?? values.instructions}
        </p>
        <p className="text-[13px] text-pace-muted">
          Due {new Date(values.dueDate).toLocaleString()}
        </p>
        {values.starterCode && (
          <pre className="overflow-x-auto rounded-lg bg-pace-canvas p-4 font-mono text-[13px]">
            {values.starterCode}
          </pre>
        )}
        <h2 className="font-bold">Visible tests</h2>
        {values.testCases
          .filter((test) => test.visible)
          .map((test, index) => (
            <div key={index} className="rounded-lg border border-pace-line p-3">
              <p className="text-xs text-pace-muted">Input → Expected output</p>
              <pre className="mt-1 whitespace-pre-wrap font-mono text-[13px]">
                {test.input}
                {" → "}
                {test.expectedOutput}
              </pre>
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
}
