import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { CodePanel } from "./code-panel";
import type { CompareData } from "./types";

const FILE_NAMES: Record<string, string> = { Python: "main.py", C: "main.c", JavaScript: "main.js", "C#": "Program.cs" };

export function CompareView({ data }: { data: CompareData }) {
  const file = FILE_NAMES[data.assignment.language] ?? "main";
  const similarity = data.similarity
    ? `${Math.round(data.similarity * 100)}% similar structure`
    : "Below the 40% flag threshold";
  return (
    <>
      <StudentTopBar
        title={`${data.left.name} ↔ ${data.right.name}`}
        subtitle={`${data.assignment.title} · ${similarity}`}
        backHref={`/dashboard/instructor/submissions/${data.assignment.id}`}
      />
      <main className="flex flex-1 flex-col gap-5 p-4 md:px-8 md:py-6">
        <p className="rounded-2xl bg-pace-amber-tint px-5 py-3 text-[13px] text-pace-ink">
          Similar structure is a prompt to review, not proof of copying. Short programs often look alike.
        </p>
        <div className="grid gap-5 lg:grid-cols-2">
          <CodePanel filename={file} caption={data.left.name} code={data.left.code} />
          <CodePanel filename={file} caption={data.right.name} code={data.right.code} />
        </div>
      </main>
    </>
  );
}
