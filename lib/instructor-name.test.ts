import { describe, expect, it } from "vitest";
import { instructorLastName, instructorTitle } from "./instructor-name";

describe("instructorTitle", () => {
  it("prefixes Prof. to a plain name", () => {
    expect(instructorTitle({ name: "Ernesto Odpaga", email: "e@x.com" })).toBe("Prof. Ernesto Odpaga");
  });

  it("does not double the prefix", () => {
    expect(instructorTitle({ name: "Prof. Ernesto Odpaga", email: "e@x.com" })).toBe("Prof. Ernesto Odpaga");
  });

  it("falls back to the email-derived name", () => {
    expect(instructorTitle({ name: null, email: "ernesto.odpaga@x.com" })).toBe("Prof. Ernesto Odpaga");
  });
});

describe("instructorLastName", () => {
  it("returns the final word with the prefix", () => {
    expect(instructorLastName({ name: "Ernesto Odpaga", email: "e@x.com" })).toBe("Prof. Odpaga");
  });
});
