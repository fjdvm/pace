import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { classColour, CLASS_COLOURS } from "../lib/class-colour";

export async function seedBrowserTeaching(instructorId: string) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query('INSERT INTO users (id, email, name) VALUES ($1, $2, $3)', [instructorId, `${instructorId}@test.com`, "Ernesto Odpaga"]);
  const names = ["CS 101 · Programming 1 · BSIT 1-1", "CS 101 · Programming 1 · BSIT 1-2", "IT 102 · Data Structures · BSIT 2-1"];
  for (const [index, name] of names.entries()) {
    let classId = randomUUID();
    while (classColour(classId) !== CLASS_COLOURS[index]) classId = randomUUID();
    await pool.query('INSERT INTO classes (id, name, instructor_id, join_code, created_at) VALUES ($1, $2, $3, $4, $5)', [classId, name, instructorId, randomUUID().slice(0, 6), new Date(Date.now() - index * 1000)]);
    const students = Array.from({ length: [32, 30, 28][index] }, () => randomUUID());
    await pool.query('INSERT INTO users (id, email) SELECT id, id || $2 FROM unnest($1::text[]) AS id', [students, `@${instructorId}.test`]);
    await pool.query('INSERT INTO enrollments (student_id, class_id) SELECT id, $2 FROM unnest($1::text[]) AS id', [students, classId]);
    if (index < 2) {
      const postId = randomUUID();
      await pool.query("INSERT INTO assignments (id, title, instructions, language, created_by, due_date) VALUES ($1, 'Sum of Two Numbers', 'Add', 'Python', $2, now())", [postId, instructorId]);
      await pool.query('INSERT INTO assignment_classes (assignment_id, class_id) VALUES ($1, $2)', [postId, classId]);
      const { rows } = await pool.query('SELECT id FROM items WHERE assignment_id = $1', [postId]);
      for (const student of students.slice(0, [12, 8][index])) {
        await pool.query("INSERT INTO submissions (id, student_id, assignment_id, item_id, code, score, test_results, behavioral_signals) VALUES ($1, $2, $3, $4, '', 0, '[]', '{}')", [randomUUID(), student, postId, rows[0].id]);
      }
    }
  }
  return async () => {
    await pool.query('DELETE FROM users WHERE id = $1 OR email LIKE $2', [instructorId, `%@${instructorId}.test`]);
    await pool.end();
  };
}
