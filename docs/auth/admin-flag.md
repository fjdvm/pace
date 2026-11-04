# Admin access

`users.is_admin` is a non-null boolean, defaulting to false. Only a database
operator grants Admin access. Server actions and admin routes read this flag from
the database; the legacy role and Auth metadata do not grant access.

## Apply before deploying the application

This repository previously used `prisma db push` and has no Prisma migration
baseline. Apply the incremental SQL to the existing database with:

```sh
npx prisma db execute --file supabase/migrations/20261104000000_add_admin_flag.sql
npx prisma generate
```

The migration runs in a transaction, adds the flag, and backfills every existing
`role = 'admin'` row to true. Do not substitute `prisma db push`: it does not run
the backfill or privilege changes. The role and approval columns remain until
all callers are migrated by the other tickets under #47.

The migration also replaces table-wide INSERT/UPDATE grants for public clients
with grants for the existing columns, excluding `is_admin`. The existing Auth
trigger inserts only the old profile columns, so new sign-ins receive false.
The Google callback writes only name/email and a temporary student role on
creation; it never copies admin metadata or overwrites the flag on an existing
User. The server database connection must use a trusted database role.

Grant or revoke Admin directly using an operator connection:

```sql
UPDATE public.users SET is_admin = true WHERE id = '<user-id>';
UPDATE public.users SET is_admin = false WHERE id = '<user-id>';
```

Admin links appear in an Admin section in the regular dashboard sidebar, on both
desktop and mobile. Platform settings includes AI provider keys and system
status; Study results includes the export. Non-admins are redirected away and
server actions reject them independently of sidebar visibility.
