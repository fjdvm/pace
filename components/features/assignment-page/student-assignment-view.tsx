import { SubmittedWorkCard } from "./submitted-work-card";
import { SubmittedMobile } from "./submitted-mobile";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { SetClassTitle } from "@/components/features/dashboard/top-bar/class-title-context";
import { AssignmentHeader } from "./assignment-header";
import { ClassComments, PrivateComments } from "./assignment-comments";
import { ItemsList } from "./items-list";
import { MobileTags } from "./mobile-tags";
import { YourWorkCard } from "./your-work-card";
import { YourWorkSheet } from "./your-work-sheet";
import type { StudentAssignmentData } from "./types";

export function StudentAssignmentView({
  data,
}: {
  data: StudentAssignmentData;
}) {
  const workHref = `/dashboard/assignments/${data.id}/work`;
  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-8 px-4 pb-64 pt-4 md:flex-row md:px-0 md:py-6">
      <SetClassTitle id={data.classId} name={data.className} />
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 md:gap-4">
        <AssignmentHeader data={data} />
        <MobileTags language={data.language} hearts={data.heartsMax} />
        <div className="flex flex-col gap-2.5 md:pl-14">
          <ItemsList
            items={data.items}
            hrefFor={(item) =>
              `${workHref}?item=${encodeURIComponent(item.id)}`
            }
          />
          {data.submission && data.submission.status !== "returned" && (
            <section className="hidden flex-col gap-3 rounded-[8px] border border-pace-line bg-white p-5 md:flex">
              <h2 className="text-base font-bold">Test results</h2>
              <p className="flex justify-between text-[13px] text-pace-ink-2">
                Visible tests{" "}
                <PaceTag>
                  {data.submission.visiblePassed} of{" "}
                  {data.submission.visibleTotal} passed
                </PaceTag>
              </p>
              <p className="flex justify-between text-[13px] text-pace-ink-2">
                Hidden tests{" "}
                <span className="text-pace-muted">
                  Checked after the due date
                </span>
              </p>
            </section>
          )}
          {data.comments && <ClassComments data={data.comments} />}
        </div>
      </div>
      <aside className="flex w-full flex-col gap-4 md:w-[300px] md:shrink-0">
        {data.submission ? (
          <SubmittedWorkCard data={data} workHref={workHref} />
        ) : (
          <YourWorkCard data={data} workHref={workHref} />
        )}

        {data.comments && (
          <PrivateComments
            data={data.comments}
            feedback={data.submission?.feedback}
          />
        )}
      </aside>
      {data.submission ? (
        <SubmittedMobile data={data} workHref={workHref} />
      ) : (
        <YourWorkSheet
          monitoringEnabled={data.monitoringEnabled}
          aiTutorEnabled={data.aiTutorEnabled}
          heartsLeft={data.heartsLeft}
          heartsMax={data.heartsMax}
          workHref={workHref}
        />
      )}
    </div>
  );
}
