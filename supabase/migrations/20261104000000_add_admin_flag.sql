BEGIN;

ALTER TABLE public.users ADD COLUMN is_admin boolean NOT NULL DEFAULT false;

UPDATE public.users SET is_admin = true WHERE role = 'admin';

REVOKE INSERT, UPDATE ON public.users FROM PUBLIC, anon, authenticated;
REVOKE INSERT (is_admin), UPDATE (id, is_admin)
ON public.users FROM PUBLIC, anon, authenticated;
GRANT INSERT (id, email, name, role, approval_status, created_at),
      UPDATE (email, name, role, approval_status, created_at)
ON public.users TO anon, authenticated;

COMMIT;
