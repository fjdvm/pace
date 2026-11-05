import type { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { itemKindLabel } from "@/lib/items/presentation";
import type { SubmissionReview } from "@/lib/submission-review-data";

export function ItemReviewTabs({
  items,
  active,
  onSelect,
  children,
}: {
  items: SubmissionReview["items"];
  active: number;
  onSelect: (index: number) => void;
  children: ReactNode;
}) {
  return (
    <Tabs
      value={active}
      onValueChange={(value) => onSelect(Number(value))}
      className="min-w-0 gap-4"
    >
      {items.length > 1 && (
        <div className="overflow-x-auto">
          <TabsList
            aria-label="Review Items"
            className="h-auto! justify-start gap-2 bg-transparent p-0"
          >
            {items.map((item, index) => (
              <TabsTrigger
                key={item.id}
                value={index}
                className="h-[38px] shrink-0 rounded-[18px] border border-pace-line bg-white px-3.5 text-[13px] data-active:border-pace-green data-active:bg-pace-green-tint"
              >
                Item {index + 1} · {itemKindLabel(item.kind)}{" "}
                <span className="text-[11px] font-bold text-pace-green-deep">
                  {item.grade ?? item.autoGrade ?? "Ungraded"}/{item.points}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      )}
      <TabsContent
        value={active}
        className="flex min-w-0 flex-col gap-3 md:gap-4"
      >
        {children}
      </TabsContent>
    </Tabs>
  );
}
