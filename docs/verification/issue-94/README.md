# AI tutor and hearts per Item (#94)

Figma is on the left, the running application on the right:

- [Asking the tutor, 1440×900](desktop-tutor-comparison.png), frame 84:1247.
- [Out of hearts, 1440×900](desktop-out-of-hearts-comparison.png), frame 84:1397.
- [Mobile tutor, 390×808 application area](mobile-tutor-comparison.png), frame 87:1612.

The mobile reference is cropped below its 36px OS status bar. The browser owns
that chrome; the application does not render a fake status bar or phone border.

## Visual comparison

The tutor uses the existing PACE tokens and Plus Jakarta Sans, 360px desktop
panel, 16px chat padding, 12px message spacing/radii, purple hint captions,
Student message bubbles, a 36px send control and the red countdown card. The
mobile view hides the desktop tutor heading and Run/Submit footer while showing
the tutor composer, as in Figma. Run and editing remain available on the Code tab.

Differences and reasons:

- The third fixture Item is Coding, rather than Figma's Multiple choice. The
  existing Item schema supports Coding; adding another kind belongs to #90's
  other tickets. This is outside the tutor panel.
- Chat copy and countdown values reflect persisted messages and real elapsed
  regeneration time. Mobile and desktop share the same Item conversation; Figma
  contains differently shortened messages on mobile. Text wraps accordingly.
- The existing Item strip is about 2px shorter than the reference. This moves the
  tutor heading and first bubble up about 2px; its #93 layout is retained.
- Existing resizable separators occupy approximately 1px. Monaco renders live
  syntax and cursor state instead of Figma's static error-line highlights.
- The mobile Item title retains #93's selector affordance. Desktop Run/Submit
  retain the existing shared button styles. Both are outside this tutor change.

## Verification

A disposable local PostgreSQL database, local auth fixture and mock streaming
Groq provider exercise the actual Next.js page, route, server actions and SDK
stream transport. No production tutor requests were made.

Verified in the browser:

- A streamed reply receives the selected Item instructions and current code.
- Each Item has independent balances, hint levels, composer input and history;
  switching back restores its conversation.
- At zero hearts the composer is disabled, while editing and Run still work.
- Regeneration restores a heart and unlocks the composer.
- Concurrent requests for the last heart allow one request and reject the other.
- A foreign Item is rejected. Browser page errors: none.

The full test suite, TypeScript, Prisma validation and lint pass. Lint retains
three existing warnings in app/layout.tsx, lib/encryption.ts and lib/gamification.ts.

## Migration

`20261105081117_item_tutor_hearts` replaces the hearts primary key with Student +
Item and adds indexes for Post summaries and Item chat history. Existing Item
references were backfilled in #91; no existing row is reassigned or deleted.
The migration fixture verifies field preservation, independent Student/Item rows
and duplicate rejection. Existing foreign keys still enforce Item/Post ownership
and cascading deletion; no entity or unrestricted CRUD endpoint is introduced.
Students cannot edit their own heart balances or erase spending history. Existing
Post/Item deletion remains under Instructor permissions.

The configured database migration was applied transactionally and recorded in
Supabase history. Before/after checksums verified all 8 hearts rows, 10 chat rows
and 1 code draft were unchanged. Prisma reports an empty schema diff.
Rollback to a Post-level key is unsafe once a Student has used multiple Items;
deploy the matching application version with this migration.
