import { NO_DATA } from "@/lib/study/analysis";
import type { GroupStats } from "@/lib/study/analysis";

export const hasData = (group: GroupStats) => group.label !== NO_DATA;
export const formatMean = (group: GroupStats) => (hasData(group) ? group.mean.toFixed(2) : "—");
export const formatSd = (group: GroupStats) => (hasData(group) ? `(${group.sd.toFixed(2)})` : "");
