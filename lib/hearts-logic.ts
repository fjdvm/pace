export function regenerateHearts(
  state: { currentCount: number; lastRegenAt: Date; totalSpent: number },
  maxHearts: number,
  regenMinutes: number,
  now = new Date(),
) {
  const cooldown = Math.max(1, regenMinutes) * 60_000;
  const count = Math.min(maxHearts, state.currentCount);
  const elapsed = Math.max(0, now.getTime() - state.lastRegenAt.getTime());
  const regenerated = Math.floor(elapsed / cooldown);
  const currentCount = Math.min(maxHearts, count + regenerated);
  return {
    currentCount,
    totalSpent: state.totalSpent,
    lastRegenAt: count >= maxHearts || currentCount >= maxHearts
      ? now
      : new Date(state.lastRegenAt.getTime() + regenerated * cooldown),
  };
}
