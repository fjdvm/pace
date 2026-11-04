type Test = { input: string; expectedOutput: string; visible: boolean };

export function sameTestCases(left: Test[], right: Test[]) {
  const key = (test: Test) =>
    JSON.stringify([test.input, test.expectedOutput, test.visible]);
  const a = left.map(key).sort();
  const b = right.map(key).sort();
  return a.length === b.length && a.every((value, index) => value === b[index]);
}
