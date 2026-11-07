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
  test(`manual Items persist, reorder and delete at ${width}`, async ({ page, context }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1100 });
    await auth.signIn(context);
    await page.goto(`/dashboard/assignments/new?classId=${classId}`);
    if (width === 1440) await expect(page.getByRole("heading", { name: "Items", exact: true })).toBeVisible();
    await page.getByLabel("Title", { exact: true }).fill("Lab Activity 3: Loops");
    await page.getByLabel("Instructions", { exact: true }).fill("Answer all items. Write your code in Python.");
    await expect(page).toHaveURL(/assignments\/.+\/edit/, { timeout: 15000 });
    if (width === 390) await page.getByRole("button", { name: "Manage items", exact: true }).click();
    const items = page.getByRole("region", { name: "Post Items", exact: true });
    await page.getByRole("button", { name: "+ Add item", exact: true }).click();
    await expect(page.getByRole("menuitem", { name: /Coding/ })).toContainText("Editor, test cases, AI tutor");
    await expect(page.getByRole("menuitem", { name: /Short answer/ })).toContainText("Typed answer, graded by you");
    await page.screenshot({ path: `/tmp/pace-165-browser/add-item-${width}.png`, fullPage: false });
    await page.getByRole("menuitem", { name: /Multiple choice/ }).click();
    await page.getByLabel("Question", { exact: true }).fill("What does break do inside a loop?");
    const options = ["Skips to the next iteration", "Exits the loop right away", "Restarts the loop", "Ends the program"];
    for (let i = 0; i < options.length; i++) await page.getByRole("textbox", { name: `Option ${i + 1}`, exact: true }).fill(options[i]);
    await page.getByRole("radio", { name: "Mark option 2 correct", exact: true }).click();
    await page.getByLabel("Points", { exact: true }).fill("15");
    await expect(page.getByText("115 points total (added up from the items)")).toBeVisible();
    await expect(page.getByText("Item 2 of 2 · 15 pts")).toBeVisible();
    await page.screenshot({ path: `/tmp/pace-165-browser/multiple-choice-${width}.png`, fullPage: false });
    await page.getByRole("button", { name: "Done", exact: true }).click();
    await expect(items).toContainText("2 items · 115 points total");
    await page.getByRole("button", { name: "+ Add item", exact: true }).click();
    await page.getByRole("menuitem", { name: /Short answer/ }).click();
    await page.getByLabel("Prompt", { exact: true }).fill("Explain when a loop stops");
    await page.getByLabel("Points", { exact: true }).fill("5");
    await page.getByRole("button", { name: "Done", exact: true }).click();
    await expect(items).toContainText("3 items · 120 points total");
    await page.getByRole("button", { name: "Move Explain when a loop stops up" }).click();
    await expect(items.getByRole("button", { name: /Explain when a loop stops Short answer/ })).toBeEnabled();
    await page.reload();
    if (width === 390) await page.getByRole("button", { name: "Manage items", exact: true }).click();
    await expect(items).toContainText("3 items · 120 points total");
    await page.getByRole("button", { name: /What does break do inside a loop\? Multiple choice/ }).click();
    await expect(page.getByRole("textbox", { name: "Option 2", exact: true })).toHaveValue("Exits the loop right away");
    await expect(page.getByRole("radio", { name: "Mark option 2 correct", exact: true })).toBeChecked();
    await items.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(items).toContainText("2 items · 105 points total");
    await items.getByRole("button", { name: /Lab Activity 3: Loops Coding/ }).click();
    await page.getByRole("button", { name: "Delete Item", exact: true }).click();
    await expect(page.getByRole("button", { name: "Delete Item", exact: true })).not.toBeVisible();
    await expect(page.getByText("1 item · 5 points total", { exact: true })).toBeAttached();
    await page.getByLabel("Title", { exact: true }).fill("Manual Items only");
    await page.getByLabel("Instructions (optional)", { exact: true }).fill("");
    if (width === 1440) await expect(page.getByRole("button", { name: /^Draft saved/ })).toBeVisible();
    else await expect(page.locator("header time")).toBeAttached();
    await page.reload();
    await expect(page.getByLabel("Title", { exact: true })).toHaveValue("Manual Items only");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
