# Post Items migration (#91)

`Assignment` remains the Post record; `Post` remains a Stream entry. Existing Posts
are assigned (`isDraft = false`), labelled Assignment, with one coding Item at
position 0 worth 100 points. This preserves existing percentage-based scores.

Items own instructions, language, starter code, points and test cases. Submissions,
code drafts, hearts and chat messages gain a required Item reference. Existing
identifiers, timestamps, content and scores are retained. Composite foreign keys
prevent attaching work to an Item from another Post. Post totals are derived from
Items when reading, never stored separately.

## Compatibility

The existing single-Item workspace still addresses work by Post ID. The migration
retains its assignment-level keys and instruction/language columns. Database
triggers create the initial coding Item for legacy assignment inserts, attach
legacy writes to the first Item, and synchronize that Item's instructions/language
with the old columns. Prisma's `dbgenerated()` marks these trigger-filled IDs.
Use Supabase migrations to install these behaviours; `prisma db push` alone cannot
install the triggers or backfill data.

The workspace and runner read the first Item and its tests. Multi-Item navigation,
per-Item turn-in answers, and replacing the legacy Post-level uniqueness constraints
belong to the subsequent workspace/submission tickets in #90. New Item actions
append in order, enforce every linked Class's Instructor permission, protect
started work, and prevent deleting the last Item. Drafts are excluded from Student
reads, Stream, Classwork, To-do, workspace, tutor and code actions.

`items` has RLS enabled with no client policies: access goes through authenticated
server actions using the existing database connection, never the public Data API.

## Apply

Apply `supabase/migrations/20261104202210_post_items.sql` before deploying the
updated application, then run `npx prisma generate`. The migration is additive and
transactional. The old application can continue using the compatibility columns
and triggers during deployment. Do not drop the new tables to roll back the app:
new Items could already contain Instructor or Student work.

## Verify migration against populated legacy tables

Use an empty, disposable local database. `MIGRATION_TEST_URL` must point to it.
The fixture checks every legacy field in all six migrated tables, initial Item
contents/defaults, old writes, and Item-to-workspace synchronization.

```sh
git show 20a3e8647f060d5dc670fd5da683f0f8da9038c6:prisma/schema.prisma > /tmp/pace-before.prisma
npx prisma migrate diff --from-empty --to-schema /tmp/pace-before.prisma --script > /tmp/pace-before.sql
psql "$MIGRATION_TEST_URL" -v ON_ERROR_STOP=1 -f /tmp/pace-before.sql
psql "$MIGRATION_TEST_URL" -f test/migrations/post-items.sql
```

Run the application tests against a separate migrated test database with
`DATABASE_URL="$TEST_DATABASE_URL" npm test`.
