BEGIN;

CREATE TABLE respondents (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL,
  code text NOT NULL UNIQUE,
  created_at timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, role)
);

ALTER TABLE study_responses
  ADD COLUMN role text,
  ADD COLUMN sitting integer,
  ADD COLUMN respondent_id text REFERENCES respondents(id) ON DELETE CASCADE,
  ADD COLUMN profile jsonb NOT NULL DEFAULT '{}',
  ALTER COLUMN ai_usage DROP NOT NULL;

CREATE UNIQUE INDEX study_responses_respondent_id_sitting_key ON study_responses (respondent_id, sitting);

CREATE TABLE study_drafts (
  respondent_id text NOT NULL REFERENCES respondents(id) ON DELETE CASCADE,
  sitting integer NOT NULL,
  state jsonb NOT NULL,
  updated_at timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (respondent_id, sitting)
);

ALTER TABLE respondents ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_drafts ENABLE ROW LEVEL SECURITY;

COMMIT;
