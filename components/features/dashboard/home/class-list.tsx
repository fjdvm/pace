import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ClassListProps = {
  title: "Teaching" | "Enrolled";
  classes: { id: string; name: string; joinCode?: string }[];
};

export function ClassList({ title, classes }: ClassListProps) {
  return (
    <section aria-label={title} className="grid gap-4">
      <h2 className="text-xl font-bold text-pace-ink">{title}</h2>
      {classes.length === 0 ? (
        <p className="text-sm text-pace-ink-2">{title === "Teaching" ? "You aren't teaching any Classes yet." : "You aren't enrolled in any Classes yet."}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {classes.map((cls) => (
            <Link key={cls.id} href={`/dashboard/classes/${cls.id}`} className="rounded-[20px] focus-visible:outline-2 focus-visible:outline-pace-purple">
              <Card className="h-full rounded-[20px] border-pace-line bg-white text-pace-ink shadow-none transition-colors hover:bg-pace-sunken">
                <CardHeader><CardTitle>{cls.name}</CardTitle></CardHeader>
                <CardContent className="text-sm text-pace-ink-2">
                  {cls.joinCode ? <>Join code: <span className="font-mono font-bold">{cls.joinCode}</span></> : "Open Class"}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
