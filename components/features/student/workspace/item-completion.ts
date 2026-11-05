export function itemComplete(results: { passed: boolean }[] | null | undefined) {
  return !!results?.length && results.every((result) => result.passed);
}
