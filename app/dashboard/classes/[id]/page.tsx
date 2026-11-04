import { ClassPage } from "@/components/features/dashboard/home/class-page";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ClassPage params={params} />;
}
