import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableProps = { headers: string[]; rows: string[][]; narrowFirst?: boolean };

const cellClass = "whitespace-normal p-3.5 align-top sm:px-5";

export function DataTable({ headers, rows, narrowFirst }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-lp-line text-[13.5px] leading-[19px] sm:text-[15px] sm:leading-[22px]">
      <Table className="table-fixed text-inherit">
        <TableHeader>
          <TableRow className="border-0 bg-lp-canvas hover:bg-lp-canvas">
            {headers.map((header, index) => (
              <TableHead
                key={header}
                className={cn(cellClass, "h-auto font-semibold text-lp-ink", index === 0 && narrowFirst && "w-[92px] sm:w-[170px]")}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.join("|")} className="border-0 border-t border-[#efede9] hover:bg-transparent">
              {row.map((cell, index) => (
                <TableCell key={index} className={cn(cellClass, "text-[#3d3d3d]")}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
