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
