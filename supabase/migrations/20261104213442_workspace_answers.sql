BEGIN;
ALTER TABLE code_drafts DROP CONSTRAINT code_drafts_pkey;
DROP INDEX code_drafts_student_id_item_id_key;
ALTER TABLE code_drafts ADD CONSTRAINT code_drafts_pkey PRIMARY KEY (student_id, item_id);
CREATE INDEX code_drafts_assignment_id_idx ON code_drafts(assignment_id);

CREATE TABLE submission_answers (
  submission_id text NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  item_id text NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  code text NOT NULL,
  score double precision NOT NULL CHECK (score >= 0 AND score <= 100),
  test_results jsonb NOT NULL,
  PRIMARY KEY (submission_id, item_id)
);
CREATE INDEX submission_answers_item_id_idx ON submission_answers(item_id);
ALTER TABLE submission_answers ENABLE ROW LEVEL SECURITY;

INSERT INTO submission_answers (submission_id, item_id, code, score, test_results)
SELECT id, item_id, code, score, test_results FROM submissions;
COMMIT;
