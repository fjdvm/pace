import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { expect, test } from "@playwright/test";
import { mockBrowserAuth } from "../../test/browser-auth";

const instructorId = randomUUID();
const classId = randomUUID();
const otherInstructor = randomUUID();
const enrolledClass = randomUUID();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
let auth: Awaited<ReturnType<typeof mockBrowserAuth>>;
test.beforeAll(async () => {
  await pool.query('INSERT INTO users (id, email, name) VALUES ($1, $2, $3)', [instructorId, `${instructorId}@test.com`, "Ernesto Odpaga"]);
  await pool.query('INSERT INTO classes (id, name, instructor_id, join_code) VALUES ($1, $2, $3, $4)', [classId, "CS 101 · Programming 1", instructorId, randomUUID()]);
  await pool.query('INSERT INTO users (id, email, name) VALUES ($1, $2, $3)', [otherInstructor, `${otherInstructor}@test.com`, "Maria Reyes"]);
  await pool.query('INSERT INTO classes (id, name, instructor_id, join_code) VALUES ($1, $2, $3, $4)', [enrolledClass, "CS 202 · Algorithms", otherInstructor, randomUUID()]);
  await pool.query('INSERT INTO enrollments (student_id, class_id) VALUES ($1, $2)', [instructorId, enrolledClass]);
  const postId = randomUUID();
  await pool.query("INSERT INTO assignments (id, title, instructions, language, created_by, due_date) VALUES ($1, 'Pending work', 'Explain', 'Python', $2, now())", [postId, otherInstructor]);
  await pool.query('INSERT INTO assignment_classes (assignment_id, class_id) VALUES ($1, $2)', [postId, enrolledClass]);
  auth = await mockBrowserAuth(instructorId);
});
test.afterAll(async () => {
  await auth?.close();
  await pool.query('DELETE FROM users WHERE id = ANY($1::text[])', [[instructorId, otherInstructor]]);
  await pool.end();
});
for (const width of [1440, 390]) {
  test(`upload, reading, retry and review at ${width}`, async ({ page, context }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await auth.signIn(context);
    await page.goto(`/dashboard/assignments/import?classId=${classId}`);
    await expect(page.getByRole("heading", { name: "Add items from a file" })).toBeVisible();
    const upload = page.getByLabel("Browse files", { exact: true });
    await expect(page.getByRole("button", { name: /Extract with AI/ })).toBeDisabled();
    await upload.setInputFiles({ name: "sheet.zip", mimeType: "application/zip", buffer: Buffer.from("x") });
    await expect(page.locator("p[role=alert]")).toContainText("Use a PDF");
    await upload.setInputFiles({ name: "Lab_Activity_3_Loops.pdf", mimeType: "application/pdf", buffer: Buffer.from("pdf") });
    await expect(page.getByText("Drag a file here, or browse")).toBeVisible();
    await page.screenshot({ path: `/tmp/pace-168/upload-${width}.png`, fullPage: true });
    let fail = true;
    await page.route("**/dashboard/assignments/import?**", async (route) => {
      if (!route.request().headers()["next-action"]) return route.continue();
      await new Promise((resolve) => setTimeout(resolve, fail && width === 1440 ? 21000 : 2000));
      const result = fail ? { success: false, error: "The AI could not read that file. Try a clearer copy." } : {
        success: true, draft: { title: "Loops", instructions: "Explain", fileName: "Lab_Activity_3_Loops.pdf", pages: 1, dropped: 0,
          items: [{ key: "one", kind: "short_answer", title: "Explain a loop", instructions: "", points: 10, fromFile: true, sourceText: "Explain a loop", checkNote: null, testCases: [], options: [] }] },
      };
      await route.fulfill({ contentType: "text/x-component", body: `0:{"a":"$@1","f":[],"b":"development"}\n1:${JSON.stringify(result)}\n` });
    });
    await page.getByRole("button", { name: /Extract with AI/ }).click();
    await expect(page.getByRole("heading", { name: "Reading your file…" })).toBeVisible();
    await expect(page.getByText(width === 1440 ? "19s elapsed · Estimated steps" : "1s elapsed · Estimated steps", { exact: true })).toBeVisible({ timeout: 22000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `/tmp/pace-168/reading-${width}.png`, fullPage: true });
    await expect(page.locator("p[role=alert]")).toContainText("could not read");
    fail = false;
    await page.getByRole("button", { name: /Extract with AI/ }).click();
    await expect(page.getByText("1 items found in Lab_Activity_3_Loops.pdf", { exact: false })).toBeVisible();
    await page.screenshot({ path: `/tmp/pace-168/review-${width}.png`, fullPage: true });
    if (width === 390) {
      await page.goto(`/dashboard/assignments/new?classId=${classId}`);
      await page.getByLabel("Title", { exact: true }).fill("Lab Activity 3: Loops");
      await expect(page).toHaveURL(/assignments\/.+\/edit/, { timeout: 15000 });
      await page.getByRole("button", { name: "Manage items", exact: true }).click();
      await page.getByRole("button", { name: "+ Add item", exact: true }).click();
      await expect(page.getByRole("link", { name: /Take a photo/ })).toBeVisible();
      await expect(page.getByRole("link", { name: /Choose a file/ })).toBeVisible();
      await expect(page.locator("[data-slot=sheet-content]")).toHaveCSS("opacity", "1");
      await page.screenshot({ path: "/tmp/pace-168/mobile-add-items-390.png", fullPage: true, animations: "disabled" });
    }
    await page.goto("/dashboard?tab=teaching");
    await expect(page.getByText("0 to review", { exact: true })).toBeVisible();
    await page.screenshot({ path: `/tmp/pace-168/cards-${width}.png`, fullPage: true });
    await page.getByRole("tab", { name: "Enrolled", exact: true }).click();
    await expect(page.getByText("1 to do", { exact: true })).toBeVisible();
    await page.screenshot({ path: `/tmp/pace-168/enrolled-${width}.png`, fullPage: true });
  });
}
