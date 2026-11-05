import { expect, test } from "@playwright/test";

const dialogHeading = (page: import("@playwright/test").Page) =>
  page.getByRole("dialog").getByRole("heading", { name: "Welcome back!" });

test.describe("desktop entry points", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  for (const name of ["I’m a student", "I’m an instructor"]) {
    test(`hero "${name}" opens the modal`, async ({ page }) => {
      await page.getByRole("link", { name }).click();
      await expect(dialogHeading(page)).toBeVisible();
    });
  }

  for (const name of ["Sign in", "Start learning", "Start teaching"]) {
    test(`footer "${name}" opens the modal`, async ({ page }) => {
      await page.locator("footer").getByRole("link", { name, exact: true }).click();
      await expect(dialogHeading(page)).toBeVisible();
    });
  }

  for (const name of ["Sign in to PACE", "Start teaching"]) {
    test(`call-to-action "${name}" opens the modal`, async ({ page }) => {
      const cta = page.locator("section", { hasText: "Taking part in the study?" });
      await cta.getByRole("link", { name }).click();
      await expect(dialogHeading(page)).toBeVisible();
    });
  }

  test("nav Sign in on the Privacy Policy page opens the modal on that page", async ({ page }) => {
    await page.goto("/privacy");
    await page.locator("header").getByRole("link", { name: "Sign in" }).click();
    await expect(dialogHeading(page)).toBeVisible();
    await expect(page).toHaveURL(/\/privacy/);
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("header").getByRole("link", { name: "Sign in" }).click();
  });

  test("nav Sign in opens the modal", async ({ page }) => {
    await expect(dialogHeading(page)).toBeVisible();
  });

  test("modal fits the screen with no horizontal scroll", async ({ page }) => {
    const dialog = page.getByRole("dialog").filter({ has: page.getByRole("heading", { name: "Welcome back!" }) });
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(667);
    const overflow = await dialog.evaluate((el) => el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight);
    expect(overflow).toBe(false);
    await expect(dialog.getByRole("button", { name: /continue with google/i })).toBeInViewport();
    await expect(dialog.getByRole("link", { name: "Privacy Policy" })).toBeInViewport();
  });
});
