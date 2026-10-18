export function formatCountdown(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const seconds = String(safe % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function tickCountdown(current: number, resetTo: number) {
  return current <= 1 ? resetTo : current - 1;
}
