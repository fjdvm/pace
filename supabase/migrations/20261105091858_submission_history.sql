BEGIN;
CREATE TABLE submission_revisions (
  id text PRIMARY KEY,
  student_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  assignment_id text NOT NULL REFERENCES assignments(id) ON DELETE CASCADE ON UPDATE CASCADE,
  snapshot jsonb NOT NULL,
  withdrawn_at timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX submission_revisions_assignment_id_student_id_withdrawn_at_idx
  ON submission_revisions (assignment_id, student_id, withdrawn_at);
CREATE INDEX submission_revisions_student_id_idx ON submission_revisions (student_id);
ALTER TABLE submission_revisions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON submission_revisions FROM PUBLIC, anon, authenticated;
COMMIT;
