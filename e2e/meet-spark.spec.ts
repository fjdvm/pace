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
  await expect(section.locator("[data-band]")).toHaveCount(0);
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
