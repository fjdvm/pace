const toPercent = (value: number) => `${((value - 1) / 4) * 100}%`;

export function PositionTrack({ student, instructor }: { student: number; instructor: number }) {
  return (
    <div
      className="relative h-2.5 w-full min-w-24 rounded-full bg-pace-sunken"
      role="img"
      aria-label={`Students ${student.toFixed(2)}, instructors ${instructor.toFixed(2)} on a 1 to 5 scale`}
    >
      <span className="absolute inset-y-0 right-0 rounded-r-full bg-pace-green-tint" style={{ left: toPercent(4.2) }} />
      {[1, 2, 3, 4].map((tick) => (
        <span key={tick} className="absolute inset-y-0 w-px bg-pace-line-strong/60" style={{ left: toPercent(tick + 1) }} />
      ))}
      <span
        className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pace-purple"
        style={{ left: toPercent(instructor) }}
      />
      <span
        className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pace-green"
        style={{ left: toPercent(student) }}
      />
    </div>
  );
}
