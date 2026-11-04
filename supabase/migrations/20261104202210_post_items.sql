BEGIN;

CREATE TYPE "PostLabel" AS ENUM ('Assignment', 'Activity', 'Quiz');

CREATE TYPE "ItemKind" AS ENUM ('coding');

ALTER TABLE "assignments" ADD COLUMN     "is_draft" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "label" "PostLabel" NOT NULL DEFAULT 'Assignment';

ALTER TABLE "test_cases" ADD COLUMN "item_id" TEXT;

ALTER TABLE "hearts_states" ADD COLUMN "item_id" TEXT;

ALTER TABLE "submissions" ADD COLUMN "item_id" TEXT;

ALTER TABLE "chat_messages" ADD COLUMN "item_id" TEXT;

ALTER TABLE "code_drafts" ADD COLUMN "item_id" TEXT;

CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "kind" "ItemKind" NOT NULL DEFAULT 'coding',
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "starter_code" TEXT NOT NULL DEFAULT '',
    "points" DOUBLE PRECISION NOT NULL DEFAULT 100,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

INSERT INTO items (id, assignment_id, position, title, instructions, language)
SELECT id, id, 0, title, instructions, language FROM assignments;

UPDATE test_cases SET item_id = assignment_id;
ALTER TABLE test_cases ALTER COLUMN item_id SET NOT NULL;

UPDATE hearts_states SET item_id = assignment_id;
ALTER TABLE hearts_states ALTER COLUMN item_id SET NOT NULL;

UPDATE submissions SET item_id = assignment_id;
ALTER TABLE submissions ALTER COLUMN item_id SET NOT NULL;

UPDATE chat_messages SET item_id = assignment_id;
ALTER TABLE chat_messages ALTER COLUMN item_id SET NOT NULL;

UPDATE code_drafts SET item_id = assignment_id;
ALTER TABLE code_drafts ALTER COLUMN item_id SET NOT NULL;

CREATE UNIQUE INDEX "items_assignment_id_position_key" ON "items"("assignment_id", "position");

CREATE UNIQUE INDEX "items_id_assignment_id_key" ON "items"("id", "assignment_id");

CREATE INDEX "test_cases_item_id_assignment_id_idx" ON "test_cases"("item_id", "assignment_id");

CREATE INDEX "hearts_states_item_id_assignment_id_idx" ON "hearts_states"("item_id", "assignment_id");

CREATE UNIQUE INDEX "hearts_states_student_id_item_id_key" ON "hearts_states"("student_id", "item_id");

CREATE INDEX "submissions_item_id_assignment_id_idx" ON "submissions"("item_id", "assignment_id");

CREATE INDEX "chat_messages_item_id_assignment_id_idx" ON "chat_messages"("item_id", "assignment_id");

CREATE INDEX "code_drafts_item_id_assignment_id_idx" ON "code_drafts"("item_id", "assignment_id");

CREATE UNIQUE INDEX "code_drafts_student_id_item_id_key" ON "code_drafts"("student_id", "item_id");

ALTER TABLE "hearts_states" ADD CONSTRAINT "hearts_states_item_id_assignment_id_fkey" FOREIGN KEY ("item_id", "assignment_id") REFERENCES "items"("id", "assignment_id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "submissions" ADD CONSTRAINT "submissions_item_id_assignment_id_fkey" FOREIGN KEY ("item_id", "assignment_id") REFERENCES "items"("id", "assignment_id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_item_id_assignment_id_fkey" FOREIGN KEY ("item_id", "assignment_id") REFERENCES "items"("id", "assignment_id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "code_drafts" ADD CONSTRAINT "code_drafts_item_id_assignment_id_fkey" FOREIGN KEY ("item_id", "assignment_id") REFERENCES "items"("id", "assignment_id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_item_id_assignment_id_fkey" FOREIGN KEY ("item_id", "assignment_id") REFERENCES "items"("id", "assignment_id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "items" ADD CONSTRAINT "items_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE items ADD CONSTRAINT items_position_check CHECK (position >= 0);
ALTER TABLE items ADD CONSTRAINT items_points_check CHECK (points >= 0 AND points < 'Infinity'::float8);
ALTER TABLE items ENABLE ROW LEVEL SECURITY;


CREATE FUNCTION public.sync_legacy_assignment_item() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF pg_trigger_depth() > 1 THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    INSERT INTO items (id, assignment_id, position, title, instructions, language)
    VALUES (NEW.id, NEW.id, 0, NEW.title, NEW.instructions, NEW.language);
  ELSE
    UPDATE items SET title = CASE WHEN NEW.title IS DISTINCT FROM OLD.title AND title = OLD.title THEN NEW.title ELSE title END,
      instructions = NEW.instructions, language = NEW.language
    WHERE id = (SELECT id FROM items WHERE assignment_id = NEW.id ORDER BY position LIMIT 1);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER assignment_coding_item
AFTER INSERT OR UPDATE OF title, instructions, language ON assignments
FOR EACH ROW EXECUTE FUNCTION public.sync_legacy_assignment_item();

CREATE FUNCTION public.sync_primary_item_assignment() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  post_id text;
  primary_item items%ROWTYPE;
BEGIN
  IF pg_trigger_depth() > 1 THEN RETURN NULL; END IF;
  post_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.assignment_id ELSE NEW.assignment_id END;
  SELECT * INTO primary_item FROM items WHERE assignment_id = post_id ORDER BY position LIMIT 1;
  IF FOUND THEN
    UPDATE assignments SET instructions = primary_item.instructions, language = primary_item.language
    WHERE id = post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER primary_item_assignment
AFTER INSERT OR UPDATE OR DELETE ON items
FOR EACH ROW EXECUTE FUNCTION public.sync_primary_item_assignment();

CREATE FUNCTION public.attach_legacy_coding_item() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.item_id IS NULL THEN
    SELECT id INTO NEW.item_id FROM items
    WHERE assignment_id = NEW.assignment_id ORDER BY position LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER test_case_item BEFORE INSERT ON test_cases
FOR EACH ROW EXECUTE FUNCTION public.attach_legacy_coding_item();
CREATE TRIGGER submission_item BEFORE INSERT ON submissions
FOR EACH ROW EXECUTE FUNCTION public.attach_legacy_coding_item();
CREATE TRIGGER code_draft_item BEFORE INSERT ON code_drafts
FOR EACH ROW EXECUTE FUNCTION public.attach_legacy_coding_item();
CREATE TRIGGER hearts_state_item BEFORE INSERT ON hearts_states
FOR EACH ROW EXECUTE FUNCTION public.attach_legacy_coding_item();
CREATE TRIGGER chat_message_item BEFORE INSERT ON chat_messages
FOR EACH ROW EXECUTE FUNCTION public.attach_legacy_coding_item();

REVOKE ALL ON FUNCTION public.sync_legacy_assignment_item() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.sync_primary_item_assignment() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.attach_legacy_coding_item() FROM PUBLIC;

COMMIT;
