import { expect, test } from "@playwright/test";

test("meet spark section shows copy and flies Spark in once", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#meet-spark");
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole("heading", { name: "Meet Spark, the pair programmer in PACE" })).toBeVisible();
  await expect(section.getByRole("tab", { name: "Students" })).toHaveAttribute("aria-selected", "true");
  await expect(section.getByRole("tab", { name: "Instructors" })).toBeVisible();
  const fly = section.locator("[data-spark-fly-in]");
  await fly.scrollIntoViewIfNeeded();
  await expect(fly).toHaveCSS("opacity", "1");
  await expect(fly.locator("[data-spark-buddy] svg")).toBeVisible();
});

test("reduced motion shows Spark without fly-in offset", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#meet-spark [data-spark-fly-in]")).toHaveCSS("opacity", "1");
});

test("students tab shows the four bands and toggle swaps them", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#meet-spark");
  for (const name of [
    "One window for the whole assignment",
    "Guided help, not ready-made answers",
    "Hearts that ask students to think first",
    "A view of how the code was made",
  ]) {
    await expect(section.getByRole("heading", { name })).toHaveCount(1);
  }
  await section.getByRole("tab", { name: "Instructors" }).click();
  await expect(section.getByRole("tab", { name: "Instructors" })).toHaveAttribute("aria-selected", "true");
  await expect(section.locator("[data-band=\"create-class\"]")).toHaveCount(1);
  await section.getByRole("tab", { name: "Students" }).click();
  await expect(section.locator("[data-band]")).toHaveCount(4);
});

test("band animations settle in view and reduced motion shows final state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const unguided = page.locator('[data-band="unguided-ai"]');
  await unguided.scrollIntoViewIfNeeded();
  await expect(unguided.getByText("what should print when n is 0?")).toBeVisible();
  await expect(page.locator('[data-band="hearts"]').getByLabel("3 of 5 hearts")).toBeVisible();
});

test("instructors tab shows the four bands", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#meet-spark");
  await section.getByRole("tab", { name: "Instructors" }).click();
  for (const name of [
    "Create a class and post activities",
    "Read each student's conversation with Spark",
    "Set how much AI help students get",
    "Review activity flags and AI summaries",
  ]) {
    await expect(section.getByRole("heading", { name })).toHaveCount(1);
  }
  await expect(section.locator("[data-band]")).toHaveCount(5);
  await expect(section.getByText("Importing an activity from a PDF or a photo is in development and is not part of the evaluation.")).toBeVisible();
});

test("instructors tab has no lab photo", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#meet-spark");
  await section.getByRole("tab", { name: "Instructors" }).click();
  await expect(section.locator("[data-lab-photo]")).toHaveCount(0);
});

for (const width of [1440, 390]) {
  test(`meet spark does not overflow at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Meet Spark, the pair programmer in PACE" })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
