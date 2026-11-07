import { SolutionCheck } from "./solution-check";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TestCaseForm } from "@/lib/assignment-form";
import { formCard } from "./form-field";

type Props = {
  classId?: string;
  language?: string;
  testCases: TestCaseForm[];
  points: number;
  locked: boolean;
  onChange: (index: number, patch: Partial<TestCaseForm>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export function CodingTests({
  classId,
  language = "Python",
  testCases,
  points,
  locked,
  onChange,
  onAdd,
  onRemove,
}: Props) {
  return (
    <section className={formCard}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
        <h2 className="text-base font-bold">Test cases</h2>
        <p className="text-[13px] leading-normal text-pace-muted">
          Visible tests are shown to students. Hidden tests run only when they
          turn in.
        </p>
        </div>
        <SolutionCheck classId={classId} language={language} testCases={testCases} />
      </div>
      {locked && (
        <p className="text-[13px] text-pace-muted">
          Tests are locked because a Student has started.
        </p>
      )}
      <div className="overflow-hidden rounded-[8px] border border-pace-line">
        <Table className="min-w-[500px] text-[13px]">
          <TableHeader className="bg-pace-sunken">
            <TableRow className="border-pace-line text-[11px] tracking-[.66px] uppercase">
              {[
                "#",
                "Input",
                "Expected output",
                "Visibility",
                "Points",
                "",
              ].map((title) => (
                <TableHead key={title} className="h-9 px-3 text-pace-muted">
                  {title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {testCases.map((test, index) => (
              <TableRow key={index} className="border-pace-line">
                <TableCell className="w-12 px-4 py-3 font-bold">
                  {index + 1}
                </TableCell>
                <TableCell className="p-2">
                  <Input
                    aria-label={`Test ${index + 1} input`}
                    disabled={locked}
                    value={test.input}
                    placeholder="2 \\n 5"
                    onChange={(event) =>
                      onChange(index, { input: event.target.value })
                    }
                    className="min-w-20 border-transparent px-1 font-mono text-[13px] shadow-none md:text-[13px]"
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Input
                    aria-label={`Test ${index + 1} expected output`}
                    disabled={locked}
                    value={test.expectedOutput}
                    onChange={(event) =>
                      onChange(index, { expectedOutput: event.target.value })
                    }
                    className="min-w-20 border-transparent px-1 font-mono text-[13px] shadow-none md:text-[13px]"
                  />
                </TableCell>
                <TableCell className="px-2">
                  <Button
                    disabled={locked}
                    aria-label={`Test ${index + 1}: ${test.visible ? "visible" : "hidden"}; toggle visibility`}
                    onClick={() => onChange(index, { visible: !test.visible })}
                    className={`h-auto rounded-full px-2.5 py-1 text-xs font-bold ${test.visible ? "bg-pace-green-tint text-pace-green-deep" : "bg-pace-sunken text-pace-ink-2"}`}
                  >
                    {test.visible ? "Visible" : "Hidden"}
                  </Button>
                </TableCell>
                <TableCell className="px-2">
                  {Math.round((points / testCases.length) * 100) / 100}
                </TableCell>
                <TableCell className="p-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      disabled={locked}
                      aria-label={`Test ${index + 1} actions`}
                      className="flex size-8 items-center justify-center"
                    >
                      <Image
                        src="/class/more.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onRemove(index)}>
                        Delete test case
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        variant="ghost"
        disabled={locked}
        onClick={onAdd}
        className="h-auto justify-start self-start p-0 text-[15px] font-bold text-pace-green-deep"
      >
        <Image src="/post/plus.svg" alt="" width={24} height={24} />
        Add test case
      </Button>
    </section>
  );
}
