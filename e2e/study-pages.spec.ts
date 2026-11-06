import { expect, test } from "@playwright/test";

const pages = [
  { path: "/study/problem", title: "Statement of the problem", copy: "How each question is answered" },
  { path: "/study/framework", title: "Conceptual framework", copy: "Evaluation model" },
  { path: "/study/methodology", title: "Methodology", copy: "Statistical treatment" },
  { path: "/students", title: "For students", copy: "Getting help from Spark" },
  { path: "/instructors", title: "For instructors", copy: "Reviewing submissions" },
  { path: "/spark", title: "Spark", copy: "Hint levels" },
  { path: "/researchers", title: "Researchers", copy: "The team" },
  { path: "/privacy-and-data", title: "Privacy and data", copy: "How long we keep it" },
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
] as const;

for (const { name, width, height } of viewports) {
  for (const { path, title, copy } of pages) {
    test(`${path} shows its content at ${name} width without sideways scroll`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      const response = await page.goto(path);
      expect(response?.ok()).toBe(true);
      await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
      await expect(page.getByRole("heading", { level: 2, name: copy })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }
}

test("desktop pages show the on-this-page list and phone pages hide it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/study/problem");
  const toc = page.getByRole("navigation", { name: "On this page" });
  await expect(toc.getByRole("link", { name: "Scope" })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(toc).toBeHidden();
});

test("footer links on a study page open the real pages", async ({ page }) => {
  await page.goto("/spark");
  const footer = page.locator("footer");
  for (const { name, path } of [
    { name: "Statement of the problem", path: "/study/problem" },
    { name: "Conceptual framework", path: "/study/framework" },
    { name: "Methodology", path: "/study/methodology" },
    { name: "For students", path: "/students" },
    { name: "For instructors", path: "/instructors" },
    { name: "Researchers", path: "/researchers" },
    { name: "Privacy and data", path: "/privacy-and-data" },
  ]) {
    await footer.getByRole("link", { name }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await page.goBack();
  }
});

test("wordmark returns to the landing page and Sign in opens the modal", async ({ page }) => {
  await page.goto("/students");
  await page.getByRole("navigation").first().getByRole("link", { name: "Sign in" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("navigation").first().getByRole("link", { name: "Pace" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("reduced motion stops transitions on study pages", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/spark");
  const duration = await page.getByRole("link", { name: "Hint levels" }).evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(parseFloat(duration)).toBe(0);
});
