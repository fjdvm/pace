const stats = [
  { value: "2", label: "setups rated by each person: the current workflow and PACE" },
  { value: "3", label: "problem areas: separate tools, AI use, and seeing how code is made" },
  { value: "4", label: "acceptance factors with 5 items each, on a 5-point scale" },
  { value: "1", label: "university setting, so results describe PUP Quezon City only" },
];

export function StudyStats() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.value} className="flex flex-col gap-1.5 border-t-2 border-pace-line pt-6">
          <p className="pace-display text-pace-ink">{stat.value}</p>
          <p className="pace-body text-pace-ink-2">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
