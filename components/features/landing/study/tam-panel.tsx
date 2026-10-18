const constructs = [
  { code: "PU", title: "Perceived usefulness", question: "“Does PACE help me practice and finish my assignments?”" },
  { code: "PEOU", title: "Perceived ease of use", question: "“Are the editor, tutor, and hearts easy to learn?”" },
  { code: "ATU", title: "Attitude toward use", question: "“Do I like using a tutor that has limits?”" },
  { code: "BI", title: "Intention to use", question: "“Would I keep using PACE and recommend it?”" },
];

export function TamPanel() {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-[32px] bg-pace-mint p-6 sm:p-8 lg:rounded-[48px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="pace-h4 text-pace-ink">Four things we ask about</p>
        <span className="pace-small rounded-full bg-white px-3 py-1.5 font-semibold text-pace-ink">
          5 items each · 2 versions
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {constructs.map((item) => (
          <div
            key={item.code}
            className="flex flex-col gap-2 rounded-3xl bg-white p-[22px] shadow-[0_4px_0_0_#bfe5c9] transition-transform duration-300 hover:-translate-y-1"
          >
            <p className="pace-stat tracking-[-0.02em] text-pace-green-deep">{item.code}</p>
            <p className="pace-body font-semibold text-pace-ink">{item.title}</p>
            <p className="pace-body text-pace-ink-2">{item.question}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
