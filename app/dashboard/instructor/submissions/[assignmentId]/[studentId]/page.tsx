import { SubmissionDetailPage } from "@/components/features/instructor/pages/submission-detail-page";

export default function Page(props: Parameters<typeof SubmissionDetailPage>[0]) {
  return <SubmissionDetailPage {...props} />;
}
