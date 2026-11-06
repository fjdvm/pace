import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export type Person = { name: string; initials: string; color: string; role: string };

export function PeopleCards({ people }: { people: Person[] }) {
  return (
    <div className="grid items-start gap-4 sm:grid-cols-3">
      {people.map((person) => (
        <Card key={person.name} className="gap-3.5 rounded-[20px] bg-lp-canvas p-6 ring-0">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg font-bold text-white" style={{ backgroundColor: person.color }}>
              {person.initials}
            </AvatarFallback>
          </Avatar>
          <p className="text-[17px] font-semibold leading-6 text-lp-ink">{person.name}</p>
          <p className="text-sm text-lp-muted">{person.role}</p>
        </Card>
      ))}
    </div>
  );
}
