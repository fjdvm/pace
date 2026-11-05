import type { SubmissionHistory } from "@/lib/submission-history";
import type { SubmissionDetail } from "@/components/features/instructor/submissions/detail/types";
import { ReviewActivity } from "../review-activity";

export function SubmissionHistoryView({
  history,
  detail,
}: {
  history: SubmissionHistory;
  detail: SubmissionDetail;
}) {
  if (!history.length) return null;
  return (
    <details className="rounded-[8px] border border-pace-line bg-white p-4 text-[13px]">
      <summary className="cursor-pointer font-bold">
        Previous turn-ins ({history.length})
      </summary>
      {history.map((revision) => (
        <section
          key={revision.id}
          className="mt-4 flex flex-col gap-3 border-t border-pace-line pt-4"
        >
          <p className="text-pace-muted">
            Turned in {new Date(revision.snapshot.submittedAt).toLocaleString()}{" "}
            · Unsubmitted {new Date(revision.withdrawnAt).toLocaleString()}
          </p>
          {(revision.snapshot.answers.length
            ? revision.snapshot.answers
            : [{ itemId: revision.id, code: revision.snapshot.code }]
          ).map((answer, index, all) => (
            <div key={answer.itemId}>
              <h3 className="mb-2 font-bold">Item {index + 1}</h3>
              <pre className="overflow-auto whitespace-pre rounded-[8px] bg-pace-canvas p-3 font-mono text-[13px]">
                {answer.code}
              </pre>
              <ReviewActivity
                detail={{ ...detail, signals: revision.snapshot.behavioralSignals }}
                item={{ id: answer.itemId, code: answer.code, language: detail.assignment.language }}
                firstItemId={all[0].itemId}
              />
            </div>
          ))}
        </section>
      ))}
    </details>
  );
}
