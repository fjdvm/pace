# Ticket #92 verification

Verified on 2026-11-05 against the running Next.js application with Playwright Chromium. The reported dropdown and composer fixes were also verified with Playwright Firefox at desktop and mobile widths. The database was an isolated local Postgres 17 container, and a local test Auth provider supplied Instructor and Student identities. Application routes, server actions, Prisma transactions and rendered components were real; production OAuth and Supabase realtime were outside this verification.

## Functional checks

- Create a Post with one coding Item, starter code, 100 points, three visible tests and two hidden tests.
- Save a Draft, reload it, and verify starter code and tests persist.
- Edit the independent Post title through mobile settings.
- Confirm the Draft is absent from the Student's To-do.
- Assign it and confirm the Student sees it in Stream, Classwork and To-do.
- Submit a private comment and see the saved comment in the feed.
- Visit the Post as the Student, then confirm starter code is disabled in the Instructor's editor while a points edit succeeds.
- Save another Draft, reopen it from Classwork, confirm deletion through the dialog, and verify it disappears.
- Browser page errors: none.

## Screenshot comparisons

The original Figma exports were placed beside screenshots taken with 1440px desktop and 390px mobile viewports. Desktop Figma previews were resized to their corresponding frame dimensions for comparison; the application screenshots were not stretched. Next.js development controls were hidden during capture.

- [Desktop editor comparison](desktop-comparison.png)
- [Mobile editor comparison](mobile-comparison.png)
- [Classwork Create menu comparison](menu-comparison.png)

Observed differences and reasons:

- The ticket explicitly requests one coding Item. The desktop frame has three mixed-kind Items and add/import controls; those additional capabilities are not represented. Later cards therefore begin higher on the page.
- Label and Language replace the unmodeled Topic field. The settings panel is correspondingly taller.
- Import from file and Material retain their menu rows but are disabled, since their behavior is outside this ticket. The menu follows its Create trigger rather than the frame's absolute mockup coordinates; its longest subtitle can wrap for readability.
- Monitoring switches show the current globally enabled behavior and are read-only; per-Post flags are not modeled.
- The sample solution-check control and passing-result badge are omitted because this ticket does not introduce an Instructor solution runner.
- The saved time, explicit Save draft/Delete actions, and mobile settings entry support the required Draft and editing workflows. The mobile device status bar and outer device frame are omitted.
- Due dates use native, localized datetime inputs; the fixture date is in 2099 so the Post remains Assigned. Longer instructions grow the mobile textarea instead of being clipped. Test rows reflect database ordering rather than the mockup's example ordering.
- The starter-code field reuses the installed monospace font and provides a line-number gutter. It is an editable textarea rather than the frame's syntax-styled static sample.
- Existing Classwork shell differences (canvas color, row width, navigation items and Class fixtures) were left unchanged. The existing feedback button remains visible on application screenshots.

The comparison found oversized radii caused by the project's customized shadcn radius scale. The new form controls now use explicit 12px radii, with 8px card and table radii, as specified by Figma.

## Reported layout fixes

- [To-do dropdown at 1440px](todo-dropdown-1440.png)
- [To-do dropdown at 390px](todo-dropdown-390.png)
- [Private comments at 1440px](private-comments-1440.png)
- [Private comments at 390px](private-comments-390.png)
- [Firefox To-do dropdown](firefox-todo-1440.png)
- [Firefox private comments](firefox-comments-1440.png)
- [Post deletion confirmation](delete-confirmation-1440.png)

The desktop dropdown measured 448px wide, with no option's scroll width exceeding its client width. Long Class names wrap on mobile. Each tab's 4px indicator ends at the tab's bottom edge, aligned with the divider.

The private-comment input and send button fit inside both a 300px desktop card and a 358px mobile card. The desktop input measured 190px wide and the mobile input 248px; both leave the send button inside the card's padding.

## Automated checks

- `npm test`: 65 files, 411 tests passed using isolated Postgres and the #91 compatibility triggers.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed with three pre-existing warnings.
- `npm run build`: passed.
- `git diff --check`: passed.
- `test/migrations/post-saved-time.sql`: passed; existing Post data is preserved with a non-null saved timestamp.

Apply `supabase/migrations/20261105050000_post_saved_time.sql` before deploying the new code and regenerate Prisma Client. No production migration was applied.
