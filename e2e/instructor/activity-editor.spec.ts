import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { expect, test } from "@playwright/test";
import { mockBrowserAuth } from "../../test/browser-auth";

const instructorId = randomUUID();
const classId = randomUUID();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
let auth: Awaited<ReturnType<typeof mockBrowserAuth>>;

test.beforeAll(async () => {
  await pool.query('INSERT INTO users (id, email, name) VALUES ($1, $2, $3)', [instructorId, `${instructorId}@test.com`, "Ernesto Odpaga"]);
  await pool.query('INSERT INTO classes (id, name, instructor_id, join_code) VALUES ($1, $2, $3, $4)', [classId, "CS 101 · Programming 1 · BSIT 1-1", instructorId, randomUUID()]);
  auth = await mockBrowserAuth(instructorId);
});
test.afterAll(async () => {
  await auth?.close();
  await pool.query('DELETE FROM users WHERE id = $1', [instructorId]);
  await pool.end();
});

for (const width of [1440, 390]) {
  test(`Coding editor saves and reloads a Draft at ${width}`, async ({ page, context }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1600 });
    const saved = width === 1440 ? page.getByRole("button", { name: /^Draft saved/ }) : page.locator("main time");
    await auth.signIn(context);
    await page.goto(`/dashboard/assignments/new?classId=${classId}`);
    if (width === 1440) await expect(page.getByRole("heading", { name: "Items", exact: true })).toBeVisible();
    await page.getByLabel("Title", { exact: true }).fill("Sum of Two Numbers");
    await page.getByLabel("Instructions", { exact: true }).fill("Read two integers and print their sum.");
    await expect(page).toHaveURL(/assignments\/.+\/edit/, { timeout: 15000 });
    await expect(saved).toBeVisible();
    if (width === 390) await page.getByRole("button", { name: "Post settings & starter code" }).click();
    await page.getByLabel("Starter code", { exact: true }).fill("a = int(input())\nb = int(input())\n# Your code here");
    if (width === 390) await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();
    await expect(saved).toBeVisible();
    await page.reload();
    await expect(page.getByLabel("Title", { exact: true })).toHaveValue("Sum of Two Numbers");
    if (width === 390) await page.getByRole("button", { name: "Edit", exact: true }).click();
    await page.getByLabel("Test 1 input", { exact: true }).fill("2\\n5");
    await page.getByLabel("Test 1 expected output", { exact: true }).fill("7");
    await page.getByRole("button", { name: "Add test case", exact: true }).click();
    await page.getByLabel("Test 2 input", { exact: true }).fill("-8\\n-2");
    await page.getByLabel("Test 2 expected output", { exact: true }).fill("-10");
    await page.getByRole("button", { name: /Test 2: visible/ }).click();
    await expect(page.getByRole("button", { name: /Test 2: hidden/ })).toBeVisible();
    if (width === 390) await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();
    await expect(saved).toBeVisible();
    await page.reload();
    if (width === 390) {
      await expect(page.getByText("1 visible · 1 hidden")).toBeVisible();
    } else {
      await expect(page.getByLabel("Starter code", { exact: true })).toHaveValue("a = int(input())\nb = int(input())\n# Your code here");
      await expect(page.getByRole("region", { name: "Post Items" })).toContainText("1 item · 100 points total");
      await page.getByRole("button", { name: "+ Add item", exact: true }).click();
      await page.getByRole("menuitem", { name: "Coding Starter code and test cases" }).click();
      await page.getByRole("button", { name: "Done", exact: true }).click();
      await expect(page.getByText("Item title is required", { exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Done", exact: true })).toBeVisible();
      await page.getByLabel("Title", { exact: true }).fill("Even or Odd");
      let releaseSave!: () => void;
      const saveGate = new Promise<void>((resolve) => { releaseSave = resolve; });
      let delayNextSave = true;
      await page.route("**/dashboard/assignments/*/edit", async (route) => {
        if (delayNextSave && route.request().headers()["next-action"]) {
          delayNextSave = false;
          await saveGate;
        }
        await route.continue();
      });
      const savingNewItem = page.waitForRequest((request) => !!request.headers()["next-action"]);
      await page.getByLabel("Instructions", { exact: true }).fill("Print parity");
      await page.getByLabel("Item points", { exact: true }).fill("30");
      await page.getByLabel("Test 1 input", { exact: true }).fill("2");
      await page.getByLabel("Test 1 expected output", { exact: true }).fill("Even");
      await savingNewItem;
      await page.getByLabel("Title", { exact: true }).fill("Even or Odd (latest)");
      releaseSave();
      await expect(page.getByRole("status").filter({ hasText: "Draft saved" })).toBeVisible();
      await page.getByRole("button", { name: "Done", exact: true }).click();
      await expect(page.getByRole("region", { name: "Post Items" })).toContainText("2 items · 130 points total");
      await page.reload();
      await expect(page.getByRole("region", { name: "Post Items" })).toContainText("Even or Odd (latest)");
      await expect(page.getByRole("region", { name: "Post Items" })).toContainText("2 items · 130 points total");
      await page.getByRole("button", { name: /Even or Odd \(latest\) Coding/ }).click();
      await page.getByLabel("Title", { exact: true }).fill("Parity");
      await expect(page.getByRole("status").filter({ hasText: "Draft saved" })).toBeVisible();
      await page.reload();
      await expect(page.getByRole("region", { name: "Post Items" })).toContainText("Parity");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `docs/verification/issue-164/editor-${width}.png`, fullPage: true });
    if (width === 390) {
      await page.getByRole("button", { name: "Manage items", exact: true }).click();
      const panel = page.getByRole("dialog");
      await panel.getByRole("button", { name: "+ Add item", exact: true }).click();
      await page.getByRole("menuitem", { name: "Coding Starter code and test cases" }).click();
      await panel.getByLabel("Title", { exact: true }).fill("Mobile Coding Item");
      await panel.getByLabel("Instructions", { exact: true }).fill("Print one");
      await panel.getByLabel("Test 1 expected output", { exact: true }).fill("1");
      await panel.getByRole("button", { name: "Done", exact: true }).click();
      await expect(panel.getByRole("region", { name: "Post Items" })).toContainText("2 items · 110 points total");
      const box = (await panel.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
  });
}
