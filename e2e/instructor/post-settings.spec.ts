import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { expect, test } from "@playwright/test";
import { mockBrowserAuth } from "../../test/browser-auth";

const instructorId = randomUUID();
const studentId = randomUUID();
const classIds = [randomUUID(), randomUUID()];
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
let auth: Awaited<ReturnType<typeof mockBrowserAuth>>;
test.beforeAll(async () => {
  for (const id of [instructorId, studentId]) await pool.query('INSERT INTO users (id, email) VALUES ($1, $2)', [id, `${id}@test.com`]);
  for (const [index, id] of classIds.entries()) {
    await pool.query('INSERT INTO classes (id, name, instructor_id, join_code) VALUES ($1, $2, $3, $4)', [id, `CS ${101 + index} · Programming ${index + 1}`, instructorId, randomUUID()]);
    await pool.query('INSERT INTO enrollments (class_id, student_id) VALUES ($1, $2)', [id, studentId]);
  }
  auth = await mockBrowserAuth(instructorId);
});
test.afterAll(async () => {
  await auth?.close();
  await pool.query('DELETE FROM users WHERE id = ANY($1)', [[instructorId, studentId]]);
  await pool.end();
});
for (const width of [1440, 390]) {
  test(`settings, assigning, editing and recording notice at ${width}`, async ({ page, context }) => {
    test.setTimeout(90000);
    const id = randomUUID();
    await pool.query(`INSERT INTO assignments (id, title, instructions, language, due_date, created_by, is_draft) VALUES ($1, 'Lab Activity 2: Input and Output', 'Read two integers and print their sum.', 'Python', '2099-10-21', $2, true)`, [id, instructorId]);
    await pool.query('INSERT INTO assignment_classes (assignment_id, class_id) VALUES ($1, $2)', [id, classIds[0]]);
    await pool.query(`INSERT INTO test_cases (id, assignment_id, item_id, input, expected_output, visible) VALUES ($1, $2, $2, '2\n5', '7', true)`, [randomUUID(), id]);
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1100 });
    await auth.signIn(context);
    await page.goto(`/dashboard/assignments/${id}/edit`);
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('switch', { name: 'AI tutor', exact: true })).toBeChecked();
    await page.getByRole('switch', { name: 'AI tutor', exact: true }).setChecked(false);
    await expect(page.getByRole('switch', { name: 'AI tutor', exact: true })).not.toBeChecked();
    await page.getByRole('switch', { name: 'Code similarity check', exact: true }).click();
    await page.screenshot({ path: `/tmp/pace-166-editor-${width}.png`, fullPage: true });
    if (width === 390) await page.getByRole('button', { name: 'Post settings & starter code' }).click();
    await page.getByRole('checkbox', { name: 'CS 102 · Programming 2' }).check();
    await page.getByLabel('Hearts per student', { exact: true }).fill('7');
    await page.getByLabel('One heart refills every (minutes)', { exact: true }).fill('20');
    if (width === 390) await page.keyboard.press('Escape');
    await expect.poll(async () => (await pool.query('SELECT hearts_count FROM assignments WHERE id=$1', [id])).rows[0].hearts_count).toBe(7);
    await page.reload();
    await expect(page.getByRole('switch', { name: 'AI tutor', exact: true })).not.toBeChecked();
    await expect(page.getByRole('switch', { name: 'Code similarity check', exact: true })).not.toBeChecked();
    await page.getByRole('button', { name: 'Assign', exact: true }).click();
    await expect(page).toHaveURL(/classes\//);
    expect((await pool.query('SELECT is_draft FROM assignments WHERE id=$1', [id])).rows[0].is_draft).toBe(false);
    expect((await pool.query('SELECT * FROM assignment_classes WHERE assignment_id=$1', [id])).rowCount).toBe(2);
    await page.goto(`/dashboard/assignments/${id}/edit`);
    await page.waitForLoadState('networkidle');
    await page.getByRole('switch', { name: 'Activity monitoring', exact: true }).click();
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page).toHaveURL(/classes\//);
    expect((await pool.query('SELECT monitoring_enabled FROM assignments WHERE id=$1', [id])).rows[0].monitoring_enabled).toBe(false);
    await auth.close();
    auth = await mockBrowserAuth(studentId);
    await context.clearCookies();
    await auth.signIn(context);
    await pool.query('UPDATE assignments SET monitoring_enabled=true WHERE id=$1', [id]);
    await page.goto(`/dashboard/assignments/${id}`);
    await expect(page.getByText('Your activity is recorded while you work on this Post, including typing, pasting, and tab switches.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue to Post' })).toBeVisible();
    await page.screenshot({ path: `/tmp/pace-166-notice-${width}.png`, fullPage: true });
    await pool.query('UPDATE assignments SET monitoring_enabled=false WHERE id=$1', [id]);
    await page.reload();
    await expect(page.getByRole('button', { name: 'Continue to Post' })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await auth.close();
    auth = await mockBrowserAuth(instructorId);
  });
}
