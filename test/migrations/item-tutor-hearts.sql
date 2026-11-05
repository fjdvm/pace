\set ON_ERROR_STOP on
CREATE SCHEMA item_tutor_test;
SET search_path = item_tutor_test;
CREATE TABLE hearts_states (
  student_id text NOT NULL, assignment_id text NOT NULL, item_id text NOT NULL,
  current_count integer NOT NULL, last_regen_at timestamptz NOT NULL, total_spent integer NOT NULL,
  CONSTRAINT hearts_states_pkey PRIMARY KEY(student_id, assignment_id)
);
CREATE UNIQUE INDEX hearts_states_student_id_item_id_key ON hearts_states(student_id, item_id);
CREATE TABLE chat_messages (student_id text, item_id text, created_at timestamptz, content text);
INSERT INTO hearts_states VALUES ('student', 'post', 'one', 2, '2026-11-05 00:00Z', 3);
INSERT INTO chat_messages VALUES ('student', 'one', '2026-11-05 00:00Z', 'Legacy hint 🦆');
\ir ../../supabase/migrations/20261105081117_item_tutor_hearts.sql
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM hearts_states WHERE student_id='student' AND item_id='one'
    AND current_count=2 AND total_spent=3 AND last_regen_at='2026-11-05 00:00Z') THEN
    RAISE EXCEPTION 'Legacy heart state changed';
  END IF;
  IF NOT EXISTS (SELECT FROM chat_messages WHERE content='Legacy hint 🦆' AND item_id='one') THEN
    RAISE EXCEPTION 'Legacy chat changed';
  END IF;
END $$;
INSERT INTO hearts_states VALUES ('student', 'post', 'two', 5, now(), 0);
INSERT INTO hearts_states VALUES ('another-student', 'post', 'one', 5, now(), 0);
DO $$ BEGIN
  BEGIN
    INSERT INTO hearts_states VALUES ('student', 'post', 'one', 5, now(), 0);
    RAISE EXCEPTION 'Duplicate Student and Item allowed';
  EXCEPTION WHEN unique_violation THEN NULL;
  END;
END $$;
DROP SCHEMA item_tutor_test CASCADE;
