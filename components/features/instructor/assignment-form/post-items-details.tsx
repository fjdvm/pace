import { Input } from "@/components/ui/input";
import { formControl } from "./form-field";
import type { useAssignmentForm } from "./use-assignment-form";

export function PostItemsDetails({
  form,
  count,
  total,
}: {
  form: ReturnType<typeof useAssignmentForm>;
  count: number;
  total: number;
}) {
  return (
    <section className="space-y-3.5 rounded-[12px] border border-pace-line bg-white p-6">
      <label className="block space-y-2 text-[13px] font-semibold">
        <span className="block">Title</span>
        <Input
          value={form.values.title}
          onChange={(e) => form.patch({ title: e.target.value })}
          className={formControl}
        />
      </label>
      <label className="block space-y-2 text-[13px] font-semibold">
        <span className="block">Instructions (optional)</span>
        <Input
          value={form.values.instructions}
          onChange={(e) => form.patch({ instructions: e.target.value })}
          className={formControl}
        />
      </label>
      <p className="text-[13px]">
        <b>{count} items</b>
        <span className="text-pace-muted">
          {" "}
          · {total} points total (added up from the items)
        </span>
      </p>
    </section>
  );
}
