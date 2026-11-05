export const PUPIL_RANGE = 4;

export function pupilOffset(dx: number, dy: number, range = PUPIL_RANGE, softness = 60) {
  const distance = Math.hypot(dx, dy);
  if (distance === 0) return { x: 0, y: 0 };
  const reach = Math.min(range, (distance / softness) * range);
  return { x: (dx / distance) * reach, y: (dy / distance) * reach };
}
