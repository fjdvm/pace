# Issue #163: Material in the Stream

- Instructor creates a titled Material with notes, an HTTP(S) link, or both; creation opens its reading view.
- Class Instructor controls creation/removal. Enrolled Students can read it, with no Items, points, due date, or hand-in control.
- Additive migration: `20261107010000_stream_material_title.sql` adds nullable `posts.title`; existing entries are preserved.
- shadcn CLI checked the existing Input, Textarea, Dialog, and Button components; all were already installed and reused.

## Verification

- Real disposable Postgres, Prisma schema plus existing legacy Item triggers: 105 Vitest files / 530 tests pass.
- `npx tsc --noEmit` and ESLint on changed files pass.
- Playwright using existing mock auth at 1440 × 900 and 390 × 844 checks menu copy, dialog bounds, creation, Instructor/Student reading, permissions, deletion and persistence after reload.
- Migration applied to the configured database and recorded in Supabase migration history; verified nullable text column exists.
- Standards review: 0 findings. Spec review: 0 code findings; gaps published on issue #163.
- Screenshots: `menu-*.png`, `dialog-*.png`, `reading-*.png`.
- Fixed stale auth mock setup in two existing test files; skip Instructor-only roster loading for Student reading pages.

## Figma gaps

Frame `86:1290` specifies the existing Create menu and “Material — Notes, slides, or links”. The Material dialog, reading view, Stream row and mobile Material layout have no supplied Figma frames. The dialog follows the existing Announcement dialog with title, notes and link fields. Existing surrounding Class page differences (background, sidebar contents, and menu placement) are outside this ticket. Fixture Class data is real database data; sample Figma Classwork rows are not fabricated.
