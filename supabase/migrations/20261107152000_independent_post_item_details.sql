DROP TRIGGER IF EXISTS primary_item_assignment ON public.items;
DROP FUNCTION IF EXISTS public.sync_primary_item_assignment();

CREATE OR REPLACE TRIGGER assignment_coding_item
AFTER INSERT ON public.assignments
FOR EACH ROW EXECUTE FUNCTION public.sync_legacy_assignment_item();
