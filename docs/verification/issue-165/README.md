# Manual Item authoring — #165

Multiple choice and Short answer authoring reuse the existing Item actions and schema. The selected manual editor is inside its Item card; points update the Post summary and Student preview while typing. The add-item menu uses Figma's manual kinds, icons and descriptions plus the existing import route. Four initial options match the manual Multiple choice frame. Saved answers and ordering survive reloads; failed saves remain editable.

An Instructor can remove the original Coding Item when another Item remains. The editor then supports a manual-only Post, including mobile Post title edits and optional Post instructions. Empty Posts and deletion after Student work remain blocked. Coding Item publication still requires complete instructions and tests. Existing permission checks protect every mutation and Students cannot retrieve answer keys.

Teaching and Enrolled share `ClassCard`: 336×316 desktop cards, 108px headers, matching instructor avatar, empty body and bottom menu. Teaching retains centered wrapping rows and a four-card maximum. Mobile uses Enrolled's compact cards. The Teaching menu retains review and join-code actions.

Migration `20261107152000_independent_post_item_details.sql` removes legacy bidirectional Post/Item synchronization, retaining initial Coding Item creation on Post INSERT. Explicit actions own all later writes. The migration changes triggers only and preserves existing rows; it prevents future overwrites but cannot reconstruct details overwritten previously. It is applied transactionally with migration history. The shadcn CLI checked installed card/button/input/radio-group/dropdown-menu components; existing components are reused. The Figma folder asset is stored locally at `public/activity-editor/import-folder.svg`.

## Verification

- Full Vitest against disposable local Postgres: 108 files, 542 tests passed.
- Final manual-only/optional-instructions regression: 27 tests passed.
- TypeScript passed. Full ESLint has zero errors and two pre-existing warnings in `app/layout.tsx` and `lib/encryption.ts`.
- All 10 mock-auth Playwright checks pass and cover desktop 1440 and mobile 390: manual creation, selected answer, points/preview, persisted options, reordering, deletion and manual-only Post title reload. Existing Coding and Material flows were also exercised.
- Screenshots: `add-item-1440.png`, `add-item-390.png`, `multiple-choice-1440.png`, `multiple-choice-390.png`, `teaching-1440.png`, `teaching-390.png`.

## Design data gaps

Actual Classes, Items, totals and timestamps replace Figma sample data. Manual Items do not claim imported provenance. Per-Post monitoring/tutor/similarity overrides, shuffle options, Topics and individual Student targeting lack backing editor capabilities. The existing platform policy controls remain disabled. These gaps are recorded for the product owner in [the issue comment](https://github.com/fjdvm/pace/issues/165#issuecomment-6708670477).

The two supplied frames are desktop designs. At 390px manual authoring uses the existing Manage items dialog; manual-only Posts use the Items layout directly. Additional order/deletion controls retain existing accessibility and started-work restrictions.

## Review

Standards: no hard violations. Optional repeated kind labels now use `itemKindLabel`.

Spec: all three findings resolved—manual-only mobile Post edits, optional Post instructions, and overview Settings card structure. GitHub Copilot review was requested, but GitHub reported insufficient remaining review quota. Separate Standards and Spec reviews completed locally.

Browser captures use viewport screenshots during editing: full-page capture temporarily changes media-query state and remounts the responsive editor. Screenshots are generated under `/tmp/pace-165-browser/` and copied here after verification.
