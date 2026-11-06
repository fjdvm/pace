import type { FormState } from "./form-progress";
import { normalizeState } from "./normalize-state";
import { parseTarget } from "./response";
import type { Sitting } from "./sitting-form";
import type { StudyRole } from "./items/types";

type Result = { ok: true; value: { role: StudyRole; sitting: Sitting; state: FormState } } | { ok: false; error: string };

export function parseDraft(role: string, sitting: number, raw: unknown, submitted: number[]): Result {
  const target = parseTarget(role, sitting, submitted);
  if (!target.ok) return target;
  return { ok: true, value: { ...target.value, state: normalizeState(target.value.role, target.value.sitting, raw) } };
}
