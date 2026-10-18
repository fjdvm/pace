import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

type CodePanelProps = {
  filename: string;
  caption: string;
  code: string;
  className?: string;
};

export function CodePanel({ filename, caption, code, className }: CodePanelProps) {
  const lines = code.replace(/\s+$/, "").split("\n");
  return (
    <section className={cn("flex min-h-[320px] flex-col overflow-hidden rounded-[20px] bg-[#141414] text-white", className)}>
      <header className="flex items-center gap-2 border-b border-white/10 px-5 py-3 font-mono text-xs text-white/70">
        <Code2 className="size-3.5" />
        {filename} · {caption}
      </header>
      <div className="flex-1 overflow-auto p-5 font-mono text-[13px] leading-[1.8]">
        <table className="border-separate border-spacing-0">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i}>
                <td className="select-none pr-5 text-right align-top text-white/35">{i + 1}</td>
                <td className="whitespace-pre align-top">{line || " "}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
