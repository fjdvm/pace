import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { seedBrowserTeaching } from "../../test/browser-teaching-fixture";
import { mockBrowserAuth } from "../../test/browser-auth";

const instructorId = randomUUID();
let auth: Awaited<ReturnType<typeof mockBrowserAuth>>;

let cleanup: (() => Promise<void>) | undefined;
test.beforeAll(async () => {
  cleanup = await seedBrowserTeaching(instructorId);
  auth = await mockBrowserAuth(instructorId);
});

test.afterAll(async () => {
  await auth?.close();
  await cleanup?.();
});

for (const width of [1440, 390]) {
  test(`Instructor Home matches the frame layout at ${width}`, async ({ page, context }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await auth.signIn(context);
    await page.goto("/dashboard");
    const teaching = page.getByRole("region", { name: "Teaching", exact: true });
    await expect(teaching).toBeVisible();
    await expect(teaching.locator('[data-slot="card"]')).toHaveCount(3);
    await expect(teaching.getByText("BSIT 1-1 · 32 students")).toBeVisible();
    await expect(teaching.getByText("BSIT 1-2 · 30 students")).toBeVisible();
    await expect(teaching.getByText("BSIT 2-1 · 28 students")).toBeVisible();
    const cards = await teaching.locator('[data-slot="card"]').evaluateAll((nodes) => nodes.map((node) => {
      const { x, y, width, height } = node.getBoundingClientRect();
      return { x, y, width, height };
    }));
    if (width === 390) {
      await expect(teaching.getByText("12 to review")).toBeVisible();
      await expect(teaching.getByText("8 to review")).toBeVisible();
      expect(cards[0]).toMatchObject({ x: 16, width: 358, height: 120 });
      expect(cards[1].y - cards[0].y).toBe(132);
      await expect(page.getByRole("button", { name: "Create class", exact: true })).toBeVisible();
    } else {
      await expect(teaching.getByText("12 turned in – Sum of Two Numbers")).toBeVisible();
      await expect(teaching.getByText("8 turned in – Sum of Two Numbers")).toBeVisible();
      expect(cards[0]).toMatchObject({ x: 304, y: 88, width: 296, height: 292 });
      expect(cards[1].x - cards[0].x).toBe(320);
    }
    await page.screenshot({ path: `docs/verification/issue-162/home-${width}.png`, fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test("creating a Class from mobile Home adds it to Teaching", async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await auth.signIn(context);
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Create class", exact: true }).click();
  await page.getByLabel("Course code").fill("CS 202");
  await page.getByLabel("Course name").fill("Algorithms");
  await page.getByLabel("Section", { exact: true }).fill("BSIT 2-2");
  await page.getByRole("dialog").getByRole("button", { name: "Create class", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("region", { name: "Teaching", exact: true }).getByText("CS 202 · Algorithms")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("region", { name: "Teaching", exact: true }).getByText("BSIT 2-2 · 0 students")).toBeVisible();
});
