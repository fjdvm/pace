export function ShortAnswerReview({ item }: { item: { title: string; code: string; grade: number | null; points: number } }) {
  return <section className="space-y-3">
    <h2 className="text-[22px] font-bold">{item.title}</h2>
    <p className="whitespace-pre-wrap break-words rounded-[8px] border border-pace-line bg-pace-canvas p-4 text-[15px] leading-[1.55]">{item.code || "Unanswered"}</p>
    <p className="text-[13px] text-pace-muted">{item.grade == null ? "Ungraded · enter points, including 0, before returning." : `${item.grade}/${item.points} points`}</p>
  </section>;
}
