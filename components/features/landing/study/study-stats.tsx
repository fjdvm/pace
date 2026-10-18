const stats = [
  { value: "2", label: "respondent groups: students and programming instructors" },
  { value: "20", label: "rating items per questionnaire version" },
  { value: "5", label: "point scale, from Strongly Disagree to Strongly Agree, with Neutral in the middle" },
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
