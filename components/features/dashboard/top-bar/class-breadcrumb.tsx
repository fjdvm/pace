import { ChevronRight } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export function ClassBreadcrumb({ name }: { name: string }) {
  return (
    <Breadcrumb className="hidden min-w-0 md:block">
      <BreadcrumbList className="flex-nowrap gap-2 text-lg leading-[1.55] text-pace-ink">
        <BreadcrumbSeparator className="text-pace-ink [&>svg]:size-6">
          <ChevronRight strokeWidth={1.5} />
        </BreadcrumbSeparator>
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className="truncate font-normal text-pace-ink">{name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
