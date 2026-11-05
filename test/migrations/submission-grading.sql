\set ON_ERROR_STOP on
CREATE SCHEMA grading_migration_test;
SET search_path = grading_migration_test;
CREATE TABLE users (id text PRIMARY KEY);
CREATE TABLE assignments (id text PRIMARY KEY);
CREATE TABLE submissions (id text PRIMARY KEY, code text, score double precision, test_results jsonb, behavioral_signals jsonb);
CREATE TABLE submission_answers (submission_id text, item_id text, code text, score double precision, test_results jsonb);
INSERT INTO submissions VALUES ('legacy', 'print(7)', 80, '[{"passed":true}]', '{"keystrokeCount":12}');
INSERT INTO submission_answers VALUES ('legacy', 'item', 'print(7)', 80, '[{"passed":true}]');
\ir ../../supabase/migrations/20261105085230_submission_grading.sql
\ir ../../supabase/migrations/20261105091858_submission_history.sql
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM submissions WHERE id='legacy' AND code='print(7)' AND score=80
    AND test_results='[{"passed":true}]' AND behavioral_signals='{"keystrokeCount":12}'
    AND status='turned_in' AND final_grade IS NULL AND feedback IS NULL AND returned_at IS NULL)
  THEN RAISE EXCEPTION 'Legacy Submission changed'; END IF;
  IF NOT EXISTS (SELECT 1 FROM submission_answers WHERE code='print(7)' AND score=80 AND grade IS NULL)
  THEN RAISE EXCEPTION 'Legacy answer changed'; END IF;
  BEGIN
    UPDATE submissions SET status='returned' WHERE id='legacy';
    RAISE EXCEPTION 'Returned without a grade';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    UPDATE submissions SET final_grade='NaN' WHERE id='legacy';
    RAISE EXCEPTION 'Accepted a non-finite grade';
  EXCEPTION WHEN check_violation THEN NULL; END;
  INSERT INTO users VALUES ('student');
  INSERT INTO assignments VALUES ('post');
  INSERT INTO submission_revisions(id,student_id,assignment_id,snapshot) VALUES ('legacy','student','post','{"code":"print(7)","behavioralSignals":{"pasteLength":74}}');
  IF NOT EXISTS (SELECT 1 FROM submission_revisions WHERE snapshot->>'code'='print(7)' AND snapshot->'behavioralSignals'->>'pasteLength'='74')
  THEN RAISE EXCEPTION 'Evidence snapshot changed'; END IF;
  IF has_table_privilege('authenticated','submission_revisions','SELECT') OR has_table_privilege('anon','submission_revisions','DELETE')
  THEN RAISE EXCEPTION 'Client can read or erase evidence'; END IF;
  UPDATE submissions SET status='graded' ,final_grade=75,feedback='Good work' WHERE id='legacy';
  UPDATE submissions SET status='returned',returned_at=now() WHERE id='legacy';
  IF has_table_privilege('authenticated','submissions','SELECT') OR has_table_privilege('anon','submissions','UPDATE')
  THEN RAISE EXCEPTION 'Client access exposes draft grades'; END IF;
END;
$$;
DROP SCHEMA grading_migration_test CASCADE;
RESET search_path;
