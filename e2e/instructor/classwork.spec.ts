import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { expect, test } from "@playwright/test";
import { mockBrowserAuth } from "../../test/browser-auth";

const instructorId = randomUUID();
const classId = randomUUID();
const draftId = randomUUID();
const publishedId = randomUUID();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
let auth: Awaited<ReturnType<typeof mockBrowserAuth>>;

test.beforeAll(async () => {
  await pool.query('INSERT INTO users (id, email, name) VALUES ($1, $2, $3)', [instructorId, `${instructorId}@test.com`, "Ernesto Odpaga"]);
  await pool.query('INSERT INTO classes (id, name, instructor_id, join_code) VALUES ($1, $2, $3, $4)', [classId, "CS 101 · Programming 1 · BSIT 1-1", instructorId, "KEBQ3D"]);
  for (const [id, title, draft] of [[draftId, "Reverse a String", true], [publishedId, "Sum of Two Numbers", false]] as const) {
    await pool.query("INSERT INTO assignments (id, title, instructions, language, created_by, is_draft, due_date) VALUES ($1, $2, 'Print one', 'Python', $3, $4, '2099-10-21')", [id, title, instructorId, draft]);
    await pool.query('INSERT INTO assignment_classes (assignment_id, class_id) VALUES ($1, $2)', [id, classId]);
  }
  auth = await mockBrowserAuth(instructorId);
});
test.afterAll(async () => {
  await auth?.close();
  await pool.query('DELETE FROM users WHERE id = $1', [instructorId]);
  await pool.end();
});

for (const width of [1440, 390]) {
  test(`Classwork copy, Drafts and all Create destinations at ${width}`, async ({ page, context }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await auth.signIn(context);
    const url = `/dashboard/classes/${classId}?tab=classwork`;
    await page.goto(url);
    await expect(page.getByRole("link", { name: "Reverse a String", exact: true })).toHaveAttribute("href", `/dashboard/assignments/${draftId}/edit`);
    await expect(page.getByText("Draft", { exact: true })).toBeVisible();
    await expect(page.getByText("0 turned in · 0 assigned", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sum of Two Numbers", exact: true })).toBeVisible();
    await page.screenshot({ path: `docs/verification/issue-167/classwork-${width}.png`, fullPage: true });
    await page.getByRole("button", { name: "+ Create", exact: true }).click();
    for (const name of ["Import from file AI builds it from a PDF, Word or photo", "Activity Add coding, quiz or written items", "Announcement Post to the class stream", "Material Notes, slides, or links"]) {
      await expect(page.getByRole("menuitem", { name, exact: true })).toBeVisible();
    }
    await expect(page.getByRole("menu")).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `docs/verification/issue-167/menu-${width}.png`, fullPage: true });
    await expect(page.getByRole("menuitem", { name: /^Import from file/ })).toHaveAttribute("href", `/dashboard/assignments/import?classId=${classId}`);
    await page.getByRole("menuitem", { name: /^Activity / }).click();
    await expect(page).toHaveURL(new RegExp(`assignments/new\\?classId=${classId}`));
    await expect(page.getByLabel("Title", { exact: true })).toBeVisible();
    for (const title of ["Announcement", "Material"]) {
      await page.goto(url);
      await page.getByRole("button", { name: "+ Create", exact: true }).click();
      await page.getByRole("menuitem", { name: new RegExp(`^${title} `) }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(page.getByRole("dialog").getByRole("button", { name: /Post|Share/, exact: true })).toBeVisible();
      await page.keyboard.press("Escape");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
