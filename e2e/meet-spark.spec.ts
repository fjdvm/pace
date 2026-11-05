import { expect, test } from "@playwright/test";

test("meet spark section shows copy and flies Spark in once", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#meet-spark");
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole("heading", { name: "Meet Spark, the pair programmer in PACE" })).toBeVisible();
  await expect(section.getByRole("button", { name: "Students" })).toHaveAttribute("aria-pressed", "true");
  await expect(section.getByRole("button", { name: "Instructors" })).toBeVisible();
  const fly = section.locator("[data-spark-fly-in]");
  await expect(fly).toHaveCSS("opacity", "1");
  await expect(section.locator("[data-spark-buddy] svg")).toBeVisible();
});

test("reduced motion shows Spark without fly-in offset", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#meet-spark [data-spark-fly-in]")).toHaveCSS("opacity", "1");
});
