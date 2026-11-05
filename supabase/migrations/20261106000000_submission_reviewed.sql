BEGIN;
ALTER TABLE submissions ADD COLUMN reviewed_at timestamp(3);
COMMIT;
