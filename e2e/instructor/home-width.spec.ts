import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { expect, test } from "@playwright/test";
import { mockBrowserAuth } from "../../test/browser-auth";

const userId = randomUUID();
const otherId = randomUUID();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
let auth: Awaited<ReturnType<typeof mockBrowserAuth>>;
test.beforeAll(async () => {
  for (const id of [userId, otherId]) {
    await pool.query('INSERT INTO users (id, email, name) VALUES ($1, $2, $3)', [id, `${id}@test.com`, "Instructor"]);
    const classId = randomUUID();
    await pool.query('INSERT INTO classes (id, name, instructor_id, join_code) VALUES ($1, $2, $3, $4)', [classId, "CS 101 · Programming 1", id, randomUUID()]);
    if (id === otherId) await pool.query('INSERT INTO enrollments (class_id, student_id) VALUES ($1, $2)', [classId, userId]);
  }
  auth = await mockBrowserAuth(userId);
});
test.afterAll(async () => {
  await auth?.close();
  await pool.query('DELETE FROM users WHERE id = ANY($1)', [[userId, otherId]]);
  await pool.end();
});
for (const width of [2400, 1440, 390]) {
  test(`Teaching and Enrolled preserve padding with a 7xl cap at ${width}`, async ({ page, context }) => {
    await page.setViewportSize({ width, height: 900 });
    await auth.signIn(context);
    await page.goto("/dashboard?tab=teaching");
    for (const view of ["Teaching", "Enrolled"]) {
      await page.getByRole("tab", { name: view, exact: true }).click();
      const region = page.getByRole("region", { name: view, exact: true });
      await expect(region).toBeVisible();
      const box = (await region.boundingBox())!;
      expect(box.width).toBeLessThanOrEqual(1280);
      expect(box.x).toBeGreaterThanOrEqual(16);
      expect(box.x + box.width).toBeLessThanOrEqual(width - 16);
      if (width === 2400) expect(box.width).toBe(1280);
      await page.screenshot({ path: `docs/verification/issue-167/${view.toLowerCase()}-${width}.png`, fullPage: true });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
