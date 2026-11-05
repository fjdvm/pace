import { expect, test } from "@playwright/test";

const errorText = "We couldn’t complete Google sign-in. Please try again.";

test("/login shows the landing page with the modal open", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in", includeHidden: true }).first()).toBeAttached();
});

test("closing the modal on /login with Escape returns to home", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("closing the modal on /login by backdrop click returns to home", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("/login?error=google_sign_in shows the error inside the modal", async ({ page }) => {
  await page.goto("/login?error=google_sign_in");
  await expect(page.getByRole("dialog").getByText(errorText)).toBeVisible();
});

test("closing from the error state clears the error and it stays gone on reopen", async ({ page }) => {
  await page.goto("/login?error=google_sign_in");
  await expect(page.getByRole("dialog").getByText(errorText)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).not.toHaveURL(/error=/);
  await page.getByRole("link", { name: "Sign in" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText(errorText)).toHaveCount(0);
});
