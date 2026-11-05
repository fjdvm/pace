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

test("hero shows Figma copy, 3D buttons and no PUP badge", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const hero = page.locator("main section").first();
  await expect(hero.getByRole("heading", { level: 1 })).toHaveText(
    "A coding platform with regulated AI for programming courses",
  );
  await expect(hero.locator("h1 em")).toHaveText("regulated AI");
  await expect(hero).toContainText("An undergraduate study at the Polytechnic University of the Philippines.");
  await expect(hero.getByRole("link", { name: "I'm a student" })).toBeVisible();
  await expect(hero.getByRole("link", { name: "I'm an instructor" })).toBeVisible();
  await expect(hero.locator("img")).toHaveCount(0);
  await expect(hero.getByText("Polytechnic University", { exact: true })).toHaveCount(0);
});

test("hero student button presses down 4px with no shadow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const button = page.locator("[data-hero-actions]").getByRole("link", { name: "I'm a student" });
  await page.waitForTimeout(700);
  const before = await button.boundingBox();
  await expect(button).toHaveCSS("box-shadow", /0px 4px 0px 0px/);
  await page.mouse.move(before!.x + 20, before!.y + 20);
  await page.mouse.down();
  await page.waitForTimeout(250);
  const after = await button.boundingBox();
  expect(after!.y - before!.y).toBeCloseTo(4, 0);
  await expect(button).not.toHaveCSS("box-shadow", /0px 4px 0px 0px/);
  await page.mouse.up();
});
