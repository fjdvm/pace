import { expect, test } from "@playwright/test";

test("desktop fan has 7 cards in 3D with perspective 1400 and rotateY 22", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const fan = page.locator("[data-hero-fan]");
  await expect(fan.locator("> div")).toHaveCSS("perspective", "1400px");
  const faces = fan.locator("[data-fan-slot] > div > div");
  await expect(faces).toHaveCount(7);
  const t = await faces.first().evaluate((el) => getComputedStyle(el).transform);
  expect(t).not.toBe("none");
});

test("hovering a card turns it to face the user", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForTimeout(1500);
  const card = page.getByText("Ask Spark why test 3 fails.").locator("xpath=ancestor::div[contains(@class,'transition-transform')][1]");
  const before = await card.evaluate((el) => getComputedStyle(el).transform);
  await card.hover({ force: true });
  await page.waitForTimeout(700);
  const after = await card.evaluate((el) => getComputedStyle(el).transform);
  expect(after).not.toBe(before);
});

test("reduced motion stops fan animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const names = await page.locator("[data-hero-fan] *").evaluateAll((els) =>
    els.map((e) => getComputedStyle(e).animationName).filter((n) => n !== "none"),
  );
  expect(names).toEqual([]);
});

test("phone fan sits above the headline and drifts", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const fan = await page.locator("[data-hero-fan]").boundingBox();
  const h1 = await page.locator("h1").boundingBox();
  expect(fan!.y).toBeLessThan(h1!.y);
  expect(fan!.width).toBeGreaterThanOrEqual(390);
  expect(await page.locator("main section").first().evaluate((el) => el.scrollWidth)).toBeLessThanOrEqual(390);
  await expect(page.locator("[data-hero-fan] > div")).toHaveCSS("animation-name", "pace-fan-drift");
});
