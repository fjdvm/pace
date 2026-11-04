import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export function ClassBreadcrumb({ id, name }: { id: string; name: string }) {
  return (
    <Breadcrumb className="hidden min-w-0 md:block">
      <BreadcrumbList className="flex-nowrap gap-2 text-lg leading-[1.55] text-pace-ink">
        <BreadcrumbSeparator className="text-pace-ink [&>svg]:size-6">
          <ChevronRight strokeWidth={1.5} />
        </BreadcrumbSeparator>
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbLink render={<Link href={`/dashboard/classes/${id}`} />} className="truncate text-pace-ink hover:text-pace-ink">
            {name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
