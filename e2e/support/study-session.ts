import { config } from "dotenv";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { Pool } from "pg";

config({ path: ".env.local", quiet: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;

export const canRunSignedIn = !!(url && anonKey && serviceKey && databaseUrl);

type Cookie = { name: string; value: string; url: string };

export type StudySession = {
  userId: string;
  cookies: Cookie[];
  dispose: () => Promise<void>;
};

export async function createStudySession(baseURL: string): Promise<StudySession> {
  const admin = createClient(url!, serviceKey!, { auth: { persistSession: false } });
  const email = `e2e-questionnaire-${Date.now()}@example.com`;

  const created = await admin.auth.admin.createUser({ email, email_confirm: true });
  if (created.error || !created.data.user) throw created.error ?? new Error("Could not create e2e user");
  const userId = created.data.user.id;

  const pool = new Pool({ connectionString: databaseUrl, max: 1 });
  try {
    await pool.query("INSERT INTO users (id, email, name) VALUES ($1, $2, $3)", [userId, email, "E2E Respondent"]);
  } catch (err) {
    await pool.end();
    await admin.auth.admin.deleteUser(userId);
    throw err;
  }

  const captured: { name: string; value: string }[] = [];
  const ssr = createServerClient(url!, anonKey!, {
    cookies: {
      getAll: () => [],
      setAll: (list) => list.forEach(({ name, value }) => captured.push({ name, value })),
    },
  });
  const link = await admin.auth.admin.generateLink({ type: "magiclink", email });
  if (link.error) throw link.error;
  const signedIn = await ssr.auth.verifyOtp({ token_hash: link.data.properties.hashed_token, type: "magiclink" });
  if (signedIn.error) throw signedIn.error;

  return {
    userId,
    cookies: captured.map(({ name, value }) => ({ name, value, url: baseURL })),
    dispose: async () => {
      await pool.query("DELETE FROM users WHERE id = $1", [userId]);
      await pool.end();
      await admin.auth.admin.deleteUser(userId);
    },
  };
}

export async function readStudyRows(userId: string) {
  const pool = new Pool({ connectionString: databaseUrl, max: 1 });
  try {
    const { rows } = await pool.query(
      `SELECT r.code, s.sitting, s.role, s.answers
         FROM respondents r JOIN study_responses s ON s.respondent_id = r.id
        WHERE r.user_id = $1 ORDER BY s.sitting`,
      [userId],
    );
    return rows as { code: string; sitting: number; role: string; answers: Record<string, { setup: string; value: number }> }[];
  } finally {
    await pool.end();
  }
}
