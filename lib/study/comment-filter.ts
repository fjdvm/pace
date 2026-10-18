import type { StudyComment } from "./dataset";
import { UNCODED_ID } from "./themes";

export type CommentFilter = { themeId: string; promptId: string; query: string };

export function filterComments(comments: StudyComment[], { themeId, promptId, query }: CommentFilter) {
  const needle = query.trim().toLowerCase();
  return comments.filter((c) => {
    if (promptId !== "all" && c.promptId !== promptId) return false;
    if (themeId === UNCODED_ID && c.themeIds.length > 0) return false;
    if (themeId !== "all" && themeId !== UNCODED_ID && !c.themeIds.includes(themeId)) return false;
    return !needle || c.text.toLowerCase().includes(needle);
  });
}

export function themeCounts(comments: StudyComment[]) {
  const byTheme: Record<string, number> = {};
  for (const comment of comments) {
    for (const id of comment.themeIds) byTheme[id] = (byTheme[id] ?? 0) + 1;
  }
  return { all: comments.length, uncoded: comments.filter((c) => c.themeIds.length === 0).length, byTheme };
}
