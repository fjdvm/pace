import { expect, test } from "@playwright/test";

test("closing CTA shows headline, credit line and opens the sign-in modal", async ({ page }) => {
  await page.goto("/");
  const cta = page.locator("#get-started");
  await cta.scrollIntoViewIfNeeded();
  await expect(cta.getByRole("heading", { name: "Take part in the evaluation" })).toBeVisible();
  await expect(cta.getByRole("img", { name: /college student/ })).toBeVisible();
  await expect(cta.locator("[data-cta-spark] svg")).toBeVisible();
  await cta.getByRole("link", { name: "Sign in with Google" }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Welcome back!" })).toBeVisible();
});

test("closing CTA fits a phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const cta = page.locator("#get-started");
  await cta.scrollIntoViewIfNeeded();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  await expect(cta.getByRole("link", { name: "Sign in with Google" })).toBeInViewport();
});

test("reduced motion shows the closing CTA content without offsets", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const cta = page.locator("#get-started");
  await cta.scrollIntoViewIfNeeded();
  await expect(cta.getByRole("heading")).toHaveCSS("opacity", "1");
  await expect(cta.locator("[data-cta-spark]")).toHaveCSS("transform", "none");
});
