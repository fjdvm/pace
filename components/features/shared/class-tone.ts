export function classTone(index: number) {
  return index % 2 === 1 ? ("purple" as const) : ("green" as const);
}
