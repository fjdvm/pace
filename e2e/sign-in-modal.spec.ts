import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Sign in" }).first().click();
});

test("opens with the Spark buddy, welcome copy, Google button and legal links", async ({ page }) => {
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("img").first()).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Welcome back!" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: /continue with google/i })).toBeVisible();
  await expect(dialog.getByText(/records typing, pasting, and tab switches/)).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Terms of Use" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Privacy Policy" })).toBeVisible();
});

test("has no close button", async ({ page }) => {
  await expect(page.getByRole("dialog").getByRole("button", { name: /close/i })).toHaveCount(0);
});

test("closes on Escape", async ({ page }) => {
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("closes on backdrop click", async ({ page }) => {
  await page.mouse.click(5, 5);
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("shows no focus ring on the Google button on open, but does after Tab", async ({ page }) => {
  const button = page.getByRole("dialog").getByRole("button", { name: /continue with google/i });
  await expect(button).not.toBeFocused();
  await page.keyboard.press("Tab");
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS("box-shadow", /rgb/);
});
