import { expect, test } from "@playwright/test";

const columns = [
  { title: "The study", links: ["Statement of the problem", "Conceptual framework", "Methodology", "Questionnaire"] },
  { title: "Platform", links: ["For students", "For instructors", "Spark"] },
  { title: "Project", links: ["Researchers", "Polytechnic University of the Philippines", "Privacy and data"] },
];

test("desktop footer is black with three columns in a row", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await expect(footer.getByRole("link", { name: "Pace" })).toBeVisible();
  const tops: number[] = [];
  for (const { title, links } of columns) {
    const heading = footer.getByText(title, { exact: true });
    await expect(heading).toBeVisible();
    tops.push((await heading.boundingBox())!.y);
    for (const name of links) await expect(footer.getByRole("link", { name })).toBeVisible();
  }
  expect(new Set(tops.map(Math.round)).size).toBe(1);
  expect((await footer.boundingBox())!.height).toBeCloseTo(410, -1);
});

test("phone footer stacks the columns", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const footer = page.locator("footer");
  const ys = [];
  for (const { title } of columns) ys.push((await footer.getByText(title, { exact: true }).boundingBox())!.y);
  expect(ys[0]).toBeLessThan(ys[1]);
  expect(ys[1]).toBeLessThan(ys[2]);
  const scroll = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scroll).toBeLessThanOrEqual(390);
});

test("footer links reach their targets", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer.getByRole("link", { name: "Questionnaire" })).toHaveAttribute("href", "/research/questionnaire");
  await expect(footer.getByRole("link", { name: "Privacy and data" })).toHaveAttribute("href", "/privacy");
  await page.goto("/privacy");
  await expect(page.locator("footer").getByRole("link", { name: "For students" })).toHaveAttribute("href", "/#meet-spark");
});

test("v3 sections are gone from the landing page", async ({ page }) => {
  await page.goto("/");
  for (const id of ["problem", "approach", "how-it-works", "study", "team"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(0);
  }
});
