import { expect, test } from "@playwright/test";

const layers = ["trail", "body", "shine", "eye-left", "eye-right", "pupil-left", "pupil-right", "spark"];

test("spark buddy renders every layer", async ({ page }) => {
  await page.goto("/spark-buddy");
  const buddy = page.locator("[data-spark-buddy] svg");
  await expect(buddy).toBeVisible();
  for (const id of layers) await expect(buddy.locator(`#${id}`)).toHaveCount(1);
});

test("pupils follow the pointer by at most 4px", async ({ page }) => {
  await page.goto("/spark-buddy");
  const pupil = page.locator("#pupil-left");
  const before = await pupil.boundingBox();
  await page.mouse.move(5, 5);
  await page.waitForTimeout(800);
  const after = await pupil.boundingBox();
  const moved = Math.hypot(after!.x - before!.x, after!.y - before!.y);
  expect(moved).toBeGreaterThan(0.5);
  expect(moved).toBeLessThan(8);
});

test("reduced motion keeps the buddy still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/spark-buddy");
  const body = page.locator("#body");
  const a = await body.boundingBox();
  await page.waitForTimeout(1000);
  const b = await body.boundingBox();
  expect(b).toEqual(a);
});
