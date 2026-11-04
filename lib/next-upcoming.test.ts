import { describe, expect, it } from "vitest";
import { nextUpcoming } from "./next-upcoming";

const now = new Date("2026-10-18T12:00:00");
const item = (title: string, due: string, status = "not started") => ({ title, dueDate: new Date(due).toISOString(), status });

describe("nextUpcoming", () => {
  it("returns the soonest assignment that is still due", () => {
    const result = nextUpcoming(
      [item("Later", "2026-10-25T23:59:00"), item("Sooner", "2026-10-19T23:59:00")],
      now,
    );
    expect(result?.title).toBe("Sooner");
  });

  it("skips submitted and past assignments", () => {
    const result = nextUpcoming(
      [item("Done", "2026-10-19T23:59:00", "submitted"), item("Past", "2026-10-10T23:59:00"), item("Open", "2026-10-30T23:59:00")],
      now,
    );
    expect(result?.title).toBe("Open");
  });

  it("returns null when nothing is due", () => {
    expect(nextUpcoming([item("Done", "2026-10-19T23:59:00", "submitted")], now)).toBeNull();
    expect(nextUpcoming([], now)).toBeNull();
  });
});
