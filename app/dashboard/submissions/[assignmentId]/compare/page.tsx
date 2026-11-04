import { CompareSubmissionsPage } from "@/components/features/instructor/pages/compare-submissions-page";

export default function Page(props: Parameters<typeof CompareSubmissionsPage>[0]) {
  return <CompareSubmissionsPage {...props} />;
}
