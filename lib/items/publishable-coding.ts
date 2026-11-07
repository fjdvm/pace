type CodingConfiguration = {
  title: string;
  instructions: string;
  testCases: { expectedOutput: string }[];
};

export function assertPublishableCodingItems(items: CodingConfiguration[]) {
  if (items.some((item) => !item.title.trim() || !item.instructions.trim() || !item.testCases.length || item.testCases.some((test) => !test.expectedOutput.trim()))) {
    throw new Error("Every Coding Item needs a title, instructions and complete test cases before assigning");
  }
}
