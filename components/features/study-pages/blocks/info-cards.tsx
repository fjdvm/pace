import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type InfoCardData = { title: string; lines: string[] };

const columns = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" } as const;

export function InfoCards({ cards }: { cards: InfoCardData[] }) {
  return (
    <div className={cn("grid gap-4", columns[cards.length as 2 | 3])}>
      {cards.map((card) => (
        <Card key={card.title} className="gap-2.5 rounded-[20px] bg-lp-canvas p-6 ring-0">
          <p className="text-lg font-semibold leading-6 text-lp-ink">{card.title}</p>
          {card.lines.map((line) => (
            <p key={line} className="text-[15px] leading-[23px] text-[#3d3d3d]">{line}</p>
          ))}
        </Card>
      ))}
    </div>
  );
}
