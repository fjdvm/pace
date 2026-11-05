ALTER TYPE "ItemKind" ADD VALUE IF NOT EXISTS 'multiple_choice';

BEGIN;
ALTER TABLE public.items ADD COLUMN options text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.items ADD COLUMN correct_option integer;
ALTER TABLE public.items ADD CONSTRAINT items_choice_key_check CHECK (
  (kind = 'coding' AND cardinality(options) = 0 AND correct_option IS NULL)
  OR (kind = 'multiple_choice' AND cardinality(options) BETWEEN 2 AND 20
    AND correct_option IS NOT NULL AND correct_option >= 0 AND correct_option < cardinality(options))
);
COMMIT;
