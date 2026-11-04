\set ON_ERROR_STOP on
BEGIN;
CREATE SCHEMA post_saved_time_test;
SET LOCAL search_path = post_saved_time_test;
CREATE TABLE assignments (id text PRIMARY KEY, title text NOT NULL);
INSERT INTO assignments VALUES ('existing', 'Existing Post');
\ir ../../supabase/migrations/20261105050000_post_saved_time.sql
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM assignments WHERE id = 'existing' AND title = 'Existing Post' AND updated_at IS NOT NULL) THEN
    RAISE EXCEPTION 'Migration did not preserve the existing Post with a saved timestamp';
  END IF;
END $$;
ROLLBACK;
