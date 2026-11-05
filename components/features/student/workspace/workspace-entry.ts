export function workspaceEntry(items: { id: string }[], requestedId?: string) {
  const requested = items.find((item) => item.id === requestedId);
  return {
    activeId: requested?.id ?? items[0].id,
    overview: items.length > 1 && !requested,
  };
}
