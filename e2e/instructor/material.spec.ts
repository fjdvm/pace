import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { expect, test } from "@playwright/test";
import { mockBrowserAuth } from "../../test/browser-auth";

const instructorId = randomUUID();
const studentId = randomUUID();
const classId = randomUUID();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
let auth: Awaited<ReturnType<typeof mockBrowserAuth>>;

test.beforeAll(async () => {
  await pool.query('INSERT INTO users (id, email, name) VALUES ($1, $2, $3)', [instructorId, `${instructorId}@test.com`, "Material Instructor"]);
  await pool.query('INSERT INTO classes (id, name, instructor_id, join_code) VALUES ($1, $2, $3, $4)', [classId, "CS 101 · Programming 1 · BSIT 1-1", instructorId, randomUUID()]);
  await pool.query('INSERT INTO users (id, email) VALUES ($1, $2)', [studentId, `${studentId}@test.com`]);
  await pool.query('INSERT INTO enrollments (class_id, student_id) VALUES ($1, $2)', [classId, studentId]);
  auth = await mockBrowserAuth(instructorId);
});
test.afterAll(async () => {
  await auth?.close();
  await pool.query('DELETE FROM users WHERE id = ANY($1)', [[instructorId, studentId]]);
  await pool.end();
});

for (const width of [1440, 390]) {
  test(`share and read Material at ${width}`, async ({ page, context }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await auth.signIn(context);
    await page.goto(`/dashboard/classes/${classId}?tab=classwork`);
    await page.getByRole("button", { name: "+ Create", exact: true }).click();
    const material = page.getByRole("menuitem", { name: "Material Notes, slides, or links" });
    await expect(material).toBeEnabled();
    await expect(material.getByText("Notes, slides, or links")).toBeVisible();
    await page.screenshot({ path: `docs/verification/issue-163/menu-${width}.png`, fullPage: true });
    await material.click();
    await page.getByLabel("Title", { exact: true }).fill(`Week 1 slides ${width}`);
    await page.getByLabel("Notes", { exact: true }).fill("Read before class");
    await page.getByLabel("Link (https://...)").fill("https://example.com/slides");
    const dialog = page.getByRole("dialog");
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    await page.screenshot({ path: `docs/verification/issue-163/dialog-${width}.png`, fullPage: true });
    await dialog.getByRole("button", { name: "Share", exact: true }).click();
    await expect(page.getByRole("heading", { name: `Week 1 slides ${width}` })).toBeVisible();
    await expect(page.getByText("Read before class", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "https://example.com/slides" })).toHaveAttribute("href", "https://example.com/slides");
    await expect(page.getByRole("button", { name: /hand.in|turn.in|submit/i })).toHaveCount(0);
    await page.screenshot({ path: `docs/verification/issue-163/reading-${width}.png`, fullPage: true });
    const readingUrl = page.url();
    await auth.close();
    auth = await mockBrowserAuth(studentId);
    await context.clearCookies();
    await auth.signIn(context);
    await page.goto(`/dashboard/classes/${classId}`);
    await expect(page.getByRole("button", { name: "+ Create", exact: true })).toHaveCount(0);
    const studentRow = page.getByRole("article").filter({ hasText: `Material: Week 1 slides ${width}` });
    await expect(studentRow).toBeVisible();
    await studentRow.getByRole("button", { name: "Post actions" }).click();
    await expect(page.getByRole("menuitem", { name: "Delete", exact: true })).toHaveCount(0);
    await page.keyboard.press("Escape");
    await page.goto(readingUrl);
    await expect(page.getByRole("heading", { name: `Week 1 slides ${width}` })).toBeVisible();
    await expect(page.getByRole("button", { name: /hand.in|turn.in|submit/i })).toHaveCount(0);
    await auth.close();
    auth = await mockBrowserAuth(instructorId);
    await context.clearCookies();
    await auth.signIn(context);
    await page.goto(`/dashboard/classes/${classId}`);
    const row = page.getByRole("article").filter({ hasText: `Material: Week 1 slides ${width}` });
    await expect(row).toBeVisible();
    await expect(row).not.toContainText(/points|due date|hand.in/i);
    await row.getByRole("button", { name: "Post actions" }).click();
    await page.getByRole("menuitem", { name: "Delete", exact: true }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Delete", exact: true }).click();
    await expect(row).toHaveCount(0);
    await page.reload();
    await expect(row).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
