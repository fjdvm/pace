# Activity editor — #164

The desktop editor follows Figma `86:1346`: Items list, selected Coding Item details, starter code, test cases, derived total points and settings sidebar. Mobile follows `87:1692` with test/heart summaries and dialogs for configuration and Items. Post title and Label stay independent of the selected Item. Existing shadcn components and exact local Figma SVGs are reused; the shadcn CLI confirmed the installed components.

Draft changes autosave after 1.2 seconds of inactivity. Additional Coding Items save independently while being edited; Done closes the editor. Failed saves remain available for explicit retry. Assigning still requires valid work and at least one Coding Item. Labels do not change access, scoring or publishing behavior. Instructor-only solution checks run all supplied tests using the existing execution service, without persisting the solution as starter code.

Fixed the nested Prisma create for a Coding Item's tests: the composite Item relation supplies the assignment ID, so specifying it again was rejected at runtime. No migration is required; existing Item/Draft columns and relationships suffice.

Teaching remains a wrapping flex layout, centered horizontally, limited to 1,256px (four 296px cards and three 24px gaps). Incomplete rows are centered, and mobile keeps its full-width stack.

## Verification

- `npx tsc --noEmit`: passed.
- Targeted ESLint: passed.
- `DATABASE_URL=<disposable local Postgres> npm test`: 107 files, 537 tests passed.
- Real-Postgres action checks cover multiple Coding Items, starter code/test persistence, totals, descriptive Labels, Draft visibility, publishing, hidden-test filtering and rejecting an empty Post. Only external execution is mocked in the solution-check test.
- Playwright with existing mock auth covers editor autosave/reload at 1440 and 390, additional Coding Item creation/editing, mobile configuration, Teaching centering at 1440/390 and a six-card layout at 2400 that wraps after four.
- Screenshots: [desktop editor](editor-1440.png), [mobile editor](editor-390.png), [desktop Teaching](teaching-1440.png), [mobile Teaching](teaching-390.png).

## Figma data gaps

- Topic and per-Student assignment targeting have no backing editor fields; only real Classes and all enrolled Students are offered.
- The schema stores points per Item, not per test. Test rows display an equal share of the selected Item's points; the Post total is the sum of Item points. Figma's sample Item/test weights are internally inconsistent (50-point Item versus five 20-point tests).
- Monitoring/tutor policies are enabled platform-wide. Existing switches display that state and remain disabled rather than suggesting a per-Post setting is saved.
- Actual Class names, enrollment, dates, Item counts and test results replace Figma sample values. Solution success appears only after execution. Mobile device border/status bar are browser chrome.
- Extra authoring controls expose Label/language, Item points, ordering, deletion and mobile Item management. They use the existing design tokens; no fabricated Topic/sample backend values are shown.
