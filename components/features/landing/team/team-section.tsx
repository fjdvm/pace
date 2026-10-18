import { SectionHeading } from "../shared/section-heading";
import { SectionShell } from "../shared/section-shell";

const people = [
  { initials: "FM", name: "Fitzjaymar Jude D. Martin", role: "Researcher", cardClassName: "bg-pace-mint", avatarClassName: "bg-pace-green text-pace-ink" },
  { initials: "JD", name: "Jhoyce Anne Niel B. Dumlao", role: "Researcher", cardClassName: "bg-pace-lavender-tint", avatarClassName: "bg-pace-purple text-white" },
  { initials: "CG", name: "Christopher M. Gabayno", role: "Researcher", cardClassName: "bg-pace-sky", avatarClassName: "bg-pace-blue text-white" },
  { initials: "EO", name: "Prof. Ernesto J. Odpaga Jr.", role: "Research adviser", cardClassName: "bg-pace-sun", avatarClassName: "bg-pace-amber text-pace-ink" },
];

export function TeamSection() {
  return (
    <SectionShell id="team" className="bg-white">
      <SectionHeading
        eyebrow="The team"
        eyebrowClassName="text-pace-purple"
        title="The people behind PACE."
        description="Students of the Polytechnic University of the Philippines, Quezon City."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {people.map((person) => (
          <div
            key={person.initials}
            className={`flex flex-col gap-1.5 rounded-[32px] px-6 pb-7 pt-6 transition-transform duration-300 hover:-translate-y-1 ${person.cardClassName}`}
          >
            <div
              className={`pace-h3 mb-2.5 flex size-[72px] items-center justify-center rounded-3xl ${person.avatarClassName}`}
            >
              {person.initials}
            </div>
            <p className="pace-h4 text-pace-ink">{person.name}</p>
            <p className="pace-body text-pace-ink-2">{person.role}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
