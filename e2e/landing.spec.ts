import { expect, test } from "@playwright/test";

for (const [name, size] of [
  ["desktop", { width: 1440, height: 900 }],
  ["phone", { width: 390, height: 844 }],
] as const) {
  test(`loads / at ${name} width`, async ({ page }) => {
    await page.setViewportSize(size);
    const response = await page.goto("/");
    expect(response?.ok()).toBe(true);
    await expect(page.getByRole("link", { name: "Sign in" }).first()).toBeVisible();
  });
}

test("nav gets background after scrolling and Get started appears after hero buttons leave view", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const bar = page.locator("header > div");
  const getStarted = page.getByTestId("nav-get-started");
  await expect(bar).toHaveAttribute("data-scrolled", "false");
  await expect(getStarted).toHaveCSS("opacity", "0");
  await page.mouse.wheel(0, 100);
  await expect(bar).toHaveAttribute("data-scrolled", "true");
  await page.evaluate(() => {
    const el = document.querySelector("[data-hero-actions]")!;
    window.scrollTo(0, el.getBoundingClientRect().bottom + window.scrollY + 50);
  });
  await expect(getStarted).toHaveCSS("opacity", "1");
  const box = await bar.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(1176);
});

test("phone nav shows wordmark and Sign in only", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const header = page.locator("header").first();
  await expect(header.getByRole("link", { name: "Pace" })).toBeVisible();
  await expect(header.getByRole("link", { name: "Sign in" })).toBeVisible();
  await expect(header.getByTestId("nav-get-started")).toBeHidden();
  await expect(header.getByRole("button", { name: "Open menu" })).toHaveCount(0);
});
