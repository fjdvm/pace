# Multiple-choice Items — #96

Instructors add multiple-choice Items to a saved Post and edit the prompt, options, answer key and points in a unified Item list. The total includes every Item, and the selected choice Item has a live Student preview. Students select, change and autosave an answer until turn-in. Instructor review displays the chosen option and automatic score.

## Playwright verification

Used Playwright against the actual Next.js pages and server actions, with a disposable local PostgreSQL database and local Auth fixture supplying distinct Instructor and Student identities. No production session or classroom data was used for browser testing.

Verified:

- Instructor creates an Item, updates its points, reads it after reload, and deletes it before any Student starts.
- Assign publishes the mixed Post. Student changes a selection, reloads and sees the saved choice, then changes it again.
- Turning in stores every Item answer atomically. Both correct multiple-choice answers scored 100%, worth 10/10 each; the mixed Post scored 28.57% (20/70 points). Coding Items had no tests in this choice-focused fixture, avoiding an external code runner dependency.
- Turned-in choices are read-only. After work starts, Instructor key/option controls and Item deletion are disabled. Mocked-action tests additionally verify server-side enforcement and stale-configuration rejection under the Post lock.
- Instructor review shows “Chosen option: do-while” and “Auto score: 10/10” on desktop and mobile.
- Student HTML contains no `correctOption` field. The selected asset loads at 22 × 22 and the back asset at 24 × 24. No horizontal overflow at 390px.
- Final browser flows have no JavaScript console errors. Temporary compile errors during component extraction were corrected before the final captures/checks.

## Figma comparisons

All four linked frames were compared side by side with the running page:

| Frame | Comparison |
| --- | --- |
| 93:1719 — Add an item | [1440px comparison](add-item-comparison.png) |
| 93:1844 — Writing manually | [1440px comparison](authoring-comparison.png) |
| 95:1811 — Student multiple choice | [1440px comparison](student-comparison.png) |
| 95:2053 — Mobile multiple choice | [390px comparison](student-mobile-comparison.png) |

Additional captures: [authoring at 390px](authoring-390.png), [Instructor review at 1440px](review-1440.png), [review at 390px](review-390.png), [Student after turn-in](student-turned-in-1440.png). Mobile Student captures use 390 × 808, matching the 844px frame after excluding its 36px OS status bar. The website does not draw phone hardware or an OS status bar.

Differences and reasons:

- The existing Post toolbar retains its title field, saved timestamp, Delete and primary Coding preview actions. These are existing authoring functions; the multiple-choice editor uses the frame's dedicated live preview. Filled values use normal ink rather than Figma's placeholder-grey examples.
- The menu offers Multiple choice. Existing Coding Items remain expandable; Short answer and file import are separate tickets. No “From file” badge or import action is fabricated for manually created Items. The menu/settings panel is consequently shorter/different from the cross-ticket mockup.
- A new Post is saved as a Draft before appending multiple-choice Items, so role-checked Item actions always address a persisted Post. Subsequent authoring uses the unified list and full point total shown in the frame.
- The shared dashboard TopBar and CLI-installed shadcn Sidebar replace the original custom workspace shell. Its shared Wordmark, account menu and menu icon retain project styling; the global plus action is only available on dashboard Home. Sidebar labels use persisted titles/kinds; the fourth Item is Multiple choice because Short answer is outside #96.
- Completion circles/counts reflect actual coding runs and saved selections. The fixture has not run its Coding Items, so it does not fabricate Figma's completed first Item or “2 of 4 done”. Turn in remains available for partial work, which scores unanswered choices zero.
- The shadcn correct-answer radio uses its standard selected dot, whereas the authoring mockup draws a check. Small text/row line-box differences follow the existing input/button primitives. The responsive authoring preview moves below the editor on mobile; no separate authoring-mobile frame is linked.
- The development tools badge and existing global feedback button appear in captures. They are outside the Item UI.

## Automated validation

All 490 tests across 86 files pass with disposable PostgreSQL. TypeScript, lint and production build pass; lint retains two existing warnings (`app/layout.tsx`, `lib/encryption.ts`) and build retains the existing tokenizer tracing warning.

Pure tests cover scoring, canonical selections and authoring validation. Mocked actions cover Class permissions, answer-key privacy, selection changes, turn-in, started-work locks and the race between initial configuration read and acquiring the Post lock. Authoring controls freeze during a save to preserve the saved snapshot.

## Migration

`20261105193802_multiple_choice_items` adds `multiple_choice`, options and a nullable correct-option index. Database checks require an in-range key for choice Items and no choice configuration for Coding Items. Existing RLS without direct client policies is retained; server actions enforce Class roles. Option order/text and the answer key lock once work starts, preserving stored zero-based selection identities.

Applied and recorded in the configured database: 15 Items, 1 draft and 0 Submissions retained unchanged. Valid/invalid keys were checked using a temporary table. Prisma reports no schema difference. No further migration is needed for the visual corrections.

## Review

See [review findings](review.md). The earlier unavailable-browser, split-authoring and custom-shell blockers are addressed by this follow-up. Copilot review was requested but GitHub reports insufficient remaining quota; independent Standards and Spec reviews were run instead.
