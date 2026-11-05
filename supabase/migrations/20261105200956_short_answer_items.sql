ALTER TYPE "ItemKind" ADD VALUE IF NOT EXISTS 'short_answer';

BEGIN;
ALTER TABLE public.items DROP CONSTRAINT items_choice_key_check;
ALTER TABLE public.items ADD CONSTRAINT items_choice_key_check CHECK (
  (kind::text IN ('coding', 'short_answer') AND cardinality(options) = 0 AND correct_option IS NULL)
  OR (kind::text = 'multiple_choice' AND cardinality(options) BETWEEN 2 AND 20
    AND correct_option IS NOT NULL AND correct_option >= 0 AND correct_option < cardinality(options))
);
ALTER TABLE public.submission_answers ALTER COLUMN score DROP NOT NULL;
COMMIT;
