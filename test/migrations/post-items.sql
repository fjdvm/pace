\set ON_ERROR_STOP on

INSERT INTO users (id, email) VALUES ('legacy-instructor', 'instructor@migration.test'), ('legacy-student', 'student@migration.test');
INSERT INTO classes (id, name, instructor_id, join_code) VALUES ('legacy-class', 'Legacy Class', 'legacy-instructor', 'LEGACY');
INSERT INTO enrollments (student_id, class_id) VALUES ('legacy-student', 'legacy-class');
INSERT INTO assignments (id, title, instructions, language, due_date, created_by)
VALUES ('legacy-assignment', 'Legacy title', 'Print 42\nwith Unicode 🦆', 'Python', '2099-01-01', 'legacy-instructor');
INSERT INTO assignment_classes VALUES ('legacy-assignment', 'legacy-class');
INSERT INTO test_cases (id, assignment_id, input, expected_output, visible)
VALUES ('legacy-visible', 'legacy-assignment', '', '42', true), ('legacy-hidden', 'legacy-assignment', 'hidden', '7', false);
INSERT INTO submissions (id, student_id, assignment_id, code, score, test_results, behavioral_signals)
VALUES ('legacy-submission', 'legacy-student', 'legacy-assignment', 'print(42)', 50, '[{"passed":true}]', '{"events":[]}');
INSERT INTO code_drafts (student_id, assignment_id, code, updated_at)
VALUES ('legacy-student', 'legacy-assignment', 'print(4)', '2026-01-02');
INSERT INTO hearts_states (student_id, assignment_id, current_count, total_spent)
VALUES ('legacy-student', 'legacy-assignment', 2, 3);
INSERT INTO chat_messages (id, student_id, assignment_id, role, content)
VALUES ('legacy-chat', 'legacy-student', 'legacy-assignment', 'user', 'How does print work?');
CREATE TEMP TABLE migration_snapshot (table_name text PRIMARY KEY, rows jsonb);
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['assignments', 'submissions', 'code_drafts', 'test_cases', 'hearts_states', 'chat_messages'] LOOP
    EXECUTE format('INSERT INTO migration_snapshot SELECT %L, jsonb_agg(to_jsonb(t) ORDER BY to_jsonb(t)::text) FROM %I t', t, t);
  END LOOP;
END $$;

\ir ../../supabase/migrations/20261104202210_post_items.sql

DO $$
DECLARE t text; actual jsonb; expected jsonb;
BEGIN
  FOREACH t IN ARRAY ARRAY['assignments', 'submissions', 'code_drafts', 'test_cases', 'hearts_states', 'chat_messages'] LOOP
    EXECUTE format('SELECT jsonb_agg(row ORDER BY row::text) FROM (SELECT to_jsonb(t) - ''item_id'' - ''is_draft'' - ''label'' AS row FROM %I t) s', t) INTO actual;
    SELECT rows INTO expected FROM migration_snapshot WHERE table_name = t;
    IF actual IS DISTINCT FROM expected THEN RAISE EXCEPTION 'Data loss in %', t; END IF;
  END LOOP;
  IF (SELECT count(*) FROM items WHERE assignment_id = 'legacy-assignment') <> 1 THEN RAISE EXCEPTION 'Missing migrated Item'; END IF;
  IF NOT EXISTS (SELECT 1 FROM items i JOIN assignments a ON i.assignment_id = a.id WHERE i.instructions = a.instructions AND i.language = a.language AND i.points = 100 AND a.label = 'Assignment' AND NOT a.is_draft) THEN RAISE EXCEPTION 'Migration defaults incorrect'; END IF;
END $$;
BEGIN;
INSERT INTO assignments (id, title, instructions, language, due_date, created_by)
VALUES ('new-assignment', 'New', 'Print 1', 'C', '2099-01-01', 'legacy-instructor');
INSERT INTO code_drafts (student_id, assignment_id, code, updated_at) VALUES ('legacy-student', 'new-assignment', 'code', now());
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM code_drafts WHERE assignment_id = 'new-assignment' AND item_id = 'new-assignment') THEN RAISE EXCEPTION 'Legacy write missing Item'; END IF;
END $$;
UPDATE items SET instructions = 'Changed through Item' WHERE id = 'new-assignment';
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM assignments WHERE id = 'new-assignment' AND instructions = 'Changed through Item') THEN RAISE EXCEPTION 'Legacy read not synchronized'; END IF;
END $$;
ROLLBACK;
SELECT 'Migration: all legacy fields preserved; exactly one coding Item; legacy writes and Item updates work' AS result;
