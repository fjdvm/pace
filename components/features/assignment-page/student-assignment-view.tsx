import { AssignmentHeader } from "./assignment-header";
import { ClassComments, PrivateComments } from "./assignment-comments";
import { ItemsList } from "./items-list";
import { MobileTags } from "./mobile-tags";
import { YourWorkCard } from "./your-work-card";
import { YourWorkSheet } from "./your-work-sheet";
import type { StudentAssignmentData } from "./types";

export function StudentAssignmentView({ data }: { data: StudentAssignmentData }) {
  const workHref = `/dashboard/assignments/${data.id}/work`;
  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-8 px-4 pb-64 pt-4 md:flex-row md:px-0 md:py-6">
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 md:gap-4">
        <AssignmentHeader data={data} />
        <MobileTags language={data.language} hearts={data.heartsMax} />
        <div className="flex flex-col gap-2.5 md:pl-14">
          <ItemsList items={data.items} hrefFor={() => workHref} />
          {data.comments && <ClassComments data={data.comments} />}
        </div>
      </div>
      <aside className="flex w-full flex-col gap-4 md:w-[300px] md:shrink-0">
        <YourWorkCard data={data} workHref={workHref} />
        {data.comments && <PrivateComments data={data.comments} />}
      </aside>
      <YourWorkSheet heartsLeft={data.heartsLeft} heartsMax={data.heartsMax} workHref={workHref} />
    </div>
  );
}
