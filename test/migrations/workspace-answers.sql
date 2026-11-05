\set ON_ERROR_STOP on
CREATE SCHEMA workspace_migration_test;
SET search_path = workspace_migration_test;
CREATE TABLE items (id text PRIMARY KEY);
CREATE TABLE submissions (id text PRIMARY KEY, item_id text NOT NULL, code text NOT NULL, score float8 NOT NULL, test_results jsonb NOT NULL);
CREATE TABLE code_drafts (student_id text NOT NULL, assignment_id text NOT NULL, item_id text NOT NULL, code text NOT NULL,
  CONSTRAINT code_drafts_pkey PRIMARY KEY(student_id, assignment_id));
CREATE UNIQUE INDEX code_drafts_student_id_item_id_key ON code_drafts(student_id, item_id);
INSERT INTO items VALUES ('one'), ('two');
INSERT INTO submissions VALUES ('legacy', 'one', 'print("🦆")', 50, '[{"passed":true,"visible":true}]');
INSERT INTO code_drafts VALUES ('student', 'post', 'one', 'print(4)');
\ir ../../supabase/migrations/20261104213442_workspace_answers.sql
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM submission_answers WHERE submission_id = 'legacy' AND item_id = 'one'
    AND code = 'print("🦆")' AND score = 50 AND test_results = '[{"passed":true,"visible":true}]'::jsonb)
    THEN RAISE EXCEPTION 'Legacy answer was not preserved'; END IF;
  IF NOT EXISTS (SELECT FROM code_drafts WHERE student_id = 'student' AND code = 'print(4)')
    THEN RAISE EXCEPTION 'Legacy draft was not preserved'; END IF;
END $$;
INSERT INTO code_drafts VALUES ('student', 'post', 'two', 'print(2)');
DO $$ BEGIN
  IF (SELECT count(*) FROM code_drafts WHERE student_id = 'student' AND assignment_id = 'post') <> 2
    THEN RAISE EXCEPTION 'Independent per-Item drafts failed'; END IF;
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid = 'submission_answers'::regclass)
    THEN RAISE EXCEPTION 'Answer RLS not enabled'; END IF;
END $$;
DELETE FROM submissions WHERE id = 'legacy';
DO $$ BEGIN
  IF EXISTS (SELECT FROM submission_answers) THEN RAISE EXCEPTION 'Answers not deleted with Submission'; END IF;
END $$;
RESET search_path;
DROP SCHEMA workspace_migration_test CASCADE;
