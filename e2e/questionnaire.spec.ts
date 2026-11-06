import { expect, test, type Page } from "@playwright/test";
import { canRunSignedIn, createStudySession, readStudyRows, type StudySession } from "./support/study-session";

const path = "/research/questionnaire";

async function begin(page: Page, sitting: 1 | 2, label: RegExp) {
  await page.goto(path);
  await page.getByRole("radio", { name: new RegExp(`Sitting ${sitting} ·`) }).click();
  await page.getByRole("checkbox", { name: /informed consent/ }).click();
  await page.getByRole("button", { name: label }).click();
}

async function answerEverything(page: Page) {
  const groups = page.getByRole("radiogroup");
  const count = await groups.count();
  for (let i = 0; i < count; i++) await groups.nth(i).getByRole("radio").first().click();
}

test.describe("start screen", () => {
  test("gates Begin behind consent and asks signed-out visitors to sign in", async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: "Evaluation questionnaire" })).toBeVisible();
    const beginButton = page.getByRole("button", { name: "Begin Sitting 1" });
    await expect(beginButton).toBeDisabled();
    await page.getByRole("checkbox", { name: /informed consent/ }).click();
    await expect(beginButton).toBeEnabled();
    await beginButton.click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  for (const width of [1440, 390]) {
    test(`fits ${width}px without sideways scroll`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await expect(page.getByRole("button", { name: "Begin Sitting 1" })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }
});

test.describe("full flow as a signed-in respondent", () => {
  test.skip(!canRunSignedIn, "needs Supabase and database credentials in .env.local");
  test.describe.configure({ mode: "serial" });

  let session: StudySession;
  test.beforeAll(async ({ baseURL }) => {
    session = await createStudySession(baseURL!);
  });
  test.afterAll(async () => {
    await session?.dispose();
  });
  test.beforeEach(async ({ context }) => {
    await context.addCookies(session.cookies);
  });

  test("Sitting 1: autosaves, resumes, submits only when complete, then locks", async ({ page }) => {
    await begin(page, 1, /Begin Sitting 1/);
    await expect(page.getByRole("heading", { level: 1, name: "Sitting 1 · Your current workflow" })).toBeVisible();
    await expect(page.getByText("0 of 33 answered")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save Sitting 1" })).toBeDisabled();

    await page.getByRole("radio", { name: "1st year" }).click();
    await page.getByRole("radiogroup", { name: /I switch between several applications/ }).getByRole("radio", { name: "Always" }).click();
    await expect(page.getByText("2 of 33 answered")).toBeVisible();
    await page.waitForTimeout(1500);

    await page.reload();
    await begin(page, 1, /Continue Sitting 1/);
    await expect(page.getByText("2 of 33 answered")).toBeVisible();
    await expect(page.getByRole("radio", { name: "Always" }).first()).toBeChecked();

    await answerEverything(page);
    await expect(page.getByText("33 of 33 answered")).toBeVisible();
    await page.getByRole("button", { name: "Save Sitting 1" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Thank you" })).toBeVisible();
    await expect(page.getByText("Your answers were saved.")).toBeVisible();

    await page.goto(path);
    await expect(page.getByRole("radio", { name: /Sitting 1 ·/ })).toBeDisabled();
    await expect(page.getByText("Submitted. This Sitting can no longer be changed.")).toBeVisible();
  });

  test("Sitting 2: rates PACE with feature items and comments, then locks", async ({ page }) => {
    await begin(page, 2, /Begin Sitting 2/);
    await expect(page.getByRole("heading", { level: 1, name: "Sitting 2 · PACE" })).toBeVisible();
    await expect(page.getByText("0 of 35 answered")).toBeVisible();
    await answerEverything(page);
    await page.getByLabel(/most helpful/).fill("The hints.");
    await expect(page.getByRole("button", { name: "Submit answers" })).toBeEnabled();
    await page.getByRole("button", { name: "Submit answers" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Thank you" })).toBeVisible();

    await page.goto(path);
    await expect(page.getByRole("radio", { name: /Sitting 2 ·/ })).toBeDisabled();
    await expect(page.getByRole("button", { name: /Sitting \d/ })).toBeDisabled();
  });

  test("links both Sittings to one pseudonymous code", async () => {
    const rows = await readStudyRows(session.userId);
    expect(rows.map((r) => r.sitting)).toEqual([1, 2]);
    expect(new Set(rows.map((r) => r.code)).size).toBe(1);
    expect(rows[0].code).toMatch(/^R-[A-Z2-9]{6}$/);
    expect(rows[0].answers.P1.setup).toBe("current");
    expect(rows[1].answers.F1.setup).toBe("pace");
  });
});
