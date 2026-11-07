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
    await expect(teaching.getByText("BSIT 1-1")).toBeVisible();
    await expect(teaching.getByText("BSIT 1-2")).toBeVisible();
    await expect(teaching.getByText("BSIT 2-1")).toBeVisible();
    const cards = await teaching.locator('[data-slot="card"]').evaluateAll((nodes) => nodes.map((node) => {
      const { x, y, width, height } = node.getBoundingClientRect();
      return { x, y, width, height };
    }));
    if (width === 390) {

      expect(cards[0]).toMatchObject({ x: 16, width: 358, height: 122 });
      expect(cards[1].y - cards[0].y).toBe(134);
      await expect(page.getByRole("button", { name: "Create class", exact: true })).toBeVisible();
    } else {
      await expect(teaching.getByRole("button", { name: /^Actions for/ })).toHaveCount(3);
      expect(cards[0]).toMatchObject({ y: 88, width: 336, height: 316 });
      const region = await teaching.boundingBox();
      expect(region).not.toBeNull();
      expect(cards[0].x).toBe(region!.x);
      expect(cards[1].x - cards[0].x).toBe(352);
    }
    await page.screenshot({ path: `/tmp/pace-165-browser/teaching-${width}.png`, fullPage: true });
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
  await expect(page.getByRole("region", { name: "Teaching", exact: true }).getByText("BSIT 2-2")).toBeVisible();
});

test("Teaching left-aligns wrapped rows and never exceeds four cards", async ({ page, context }) => {
  await page.setViewportSize({ width: 2400, height: 1000 });
  await auth.signIn(context);
  await page.goto("/dashboard");
  const teaching = page.getByRole("region", { name: "Teaching", exact: true });
  await expect(teaching).toBeVisible();
  await teaching.evaluate((section) => {
    const card = section.querySelector('[data-slot="card"]')!;
    while (section.children.length < 6) section.append(card.cloneNode(true));
  });
  const cards = await teaching.locator('[data-slot="card"]').evaluateAll((nodes) => nodes.map((node) => {
    const { x, y, width } = node.getBoundingClientRect();
    return { x, y, width };
  }));
  expect(cards.filter((card) => card.y === cards[0].y)).toHaveLength(4);
  expect(cards[4].y).toBeGreaterThan(cards[0].y);
  const region = (await teaching.boundingBox())!;
  for (const row of [cards.slice(0, 4), cards.slice(4)]) {
    expect(row[0].x).toBe(region.x);
  }
});
