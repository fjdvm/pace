export const READING_STAGES = [
  { title: "Reading the file", hint: "Pages, printed or handwritten text" },
  { title: "Finding the items", hint: "Splitting the sheet into separate tasks" },
  { title: "Writing test cases", hint: "From the examples in your file" },
  { title: "Checking the draft", hint: "Flags anything the AI was unsure about" },
];

export function ReadingStages({ stage }: { stage: number }) {
  return (
    <ol className="space-y-5">
      {READING_STAGES.map((s, i) => {
        const state = i < stage ? "done" : i === stage ? "active" : "todo";
        return (
          <li key={s.title} className="flex items-start gap-3.5">
            <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white ${state === "done" ? "bg-pace-green" : state === "active" ? "bg-pace-purple" : "bg-pace-sunken"}`}>
              {state === "done" ? "✓" : state === "active" ? "•" : ""}
            </span>
            <div className={state === "todo" ? "text-pace-muted" : ""}>
              <p className="text-[15px] font-bold leading-[1.55]">{s.title}</p>
              <p className="text-[13px] text-pace-muted">{s.hint}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
