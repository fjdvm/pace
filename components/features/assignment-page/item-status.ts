import type { ItemStatus } from "./types";

export function deriveItemStatus(hasSubmission: boolean, hasDraft: boolean): ItemStatus {
  if (hasSubmission) return "submitted";
  return hasDraft ? "in-progress" : "not-started";
}

export function workStatusLabel(items: { status: ItemStatus }[]) {
  if (items.length > 0 && items.every((i) => i.status === "submitted")) return "Submitted";
  if (items.some((i) => i.status !== "not-started")) return "In progress";
  return "Assigned";
}

export function itemStatusLabel(status: ItemStatus) {
  if (status === "submitted") return "submitted";
  return status === "in-progress" ? "in progress" : "not started";
}

export function startLabel(items: { status: ItemStatus }[]) {
  const index = items.findIndex((i) => i.status !== "submitted");
  if (index === -1) return "Review item 1";
  const verb = items[index].status === "in-progress" ? "Continue" : "Start";
  return `${verb} item ${index + 1}`;
}
