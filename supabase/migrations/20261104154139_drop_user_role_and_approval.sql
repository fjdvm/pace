BEGIN;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.users WHERE role = 'admin' AND NOT is_admin) THEN
    RAISE EXCEPTION 'Apply the admin flag backfill before dropping legacy User columns';
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

ALTER TABLE public.users
  DROP COLUMN role,
  DROP COLUMN approval_status;

COMMIT;
