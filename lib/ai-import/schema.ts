import { jsonSchema } from "ai";
import type { JSONSchema7 } from "json-schema";

const testCase: JSONSchema7 = {
  type: "object",
  properties: {
    input: { type: "string" },
    expectedOutput: { type: "string" },
    visible: { type: "boolean" },
    fromExample: { type: "boolean" },
  },
  required: ["input", "expectedOutput", "visible", "fromExample"],
};

const item: JSONSchema7 = {
  type: "object",
  properties: {
    kind: { type: "string", enum: ["coding", "multiple_choice", "short_answer"] },
    title: { type: "string" },
    instructions: { type: "string" },
    points: { type: "number" },
    starterCode: { type: "string" },
    options: { type: "array", items: { type: "string" } },
    correctOption: { type: "integer" },
    testCases: { type: "array", items: testCase },
    checkNote: { type: "string" },
    sourceText: { type: "string" },
  },
  required: ["kind", "title", "instructions", "points", "sourceText"],
};

export const importSchema = jsonSchema<{
  title: string;
  instructions: string;
  pages?: number;
  items: unknown[];
}>({
  type: "object",
  properties: {
    title: { type: "string" },
    instructions: { type: "string" },
    pages: { type: "integer" },
    items: { type: "array", items: item },
  },
  required: ["title", "items"],
});
