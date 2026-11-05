BEGIN;
CREATE TYPE "SubmissionStatus" AS ENUM ('turned_in', 'graded', 'returned');
ALTER TABLE submissions
  ADD COLUMN status "SubmissionStatus" NOT NULL DEFAULT 'turned_in',
  ADD COLUMN final_grade double precision,
  ADD COLUMN feedback text,
  ADD COLUMN returned_at timestamp(3),
  ADD CONSTRAINT submissions_final_grade_valid CHECK (final_grade IS NULL OR (final_grade >= 0 AND final_grade < 'Infinity'::float8)),
  ADD CONSTRAINT submissions_returned_grade CHECK (status <> 'returned' OR (final_grade IS NOT NULL AND returned_at IS NOT NULL));
ALTER TABLE submission_answers ADD COLUMN grade double precision
  CHECK (grade IS NULL OR (grade >= 0 AND grade < 'Infinity'::float8));
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON submissions, submission_answers FROM PUBLIC, anon, authenticated;
COMMIT;
