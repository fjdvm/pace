# Insights sheet for review — #100

## Audit of existing signals
Before: the workspace recorded paste length, tab away/back, test runs, keystroke count and turn-in, but one event list per Post, not per Item, and no tutor questions or "opened" marker. Risk score (fixed thresholds, pure tests), similarity (Post level) and the review activity card already existed.

Now: events carry the Item (`open`, `typing`, `paste` with line count, `tab_switch`, `run_attempt`); tutor questions come from the Item's chat rows; legacy events without an Item count toward the first Item. Turn-in is shared by all Items.

## What was built
- Per-Item activity log, summary numbers and Low/Med/High flag (`lib/insights/`, pure, tested). The flag per Student in the list is the stored risk score; thresholds are unchanged and never come from the AI.
- Insights sheet (right drawer at desktop, bottom sheet at mobile): flag banner, log, three next steps, fixed not-proof note.
- One Gemini call writes the summary, explanation, suggested comment, similarity note and draft note. It is stubbed in tests. If the key is missing or the call fails, the log and flag still show with an error.
- Similarity runs per Item across the same Post's Submissions; "similar" means 80% or more, matching the frame's copy.
- Send suggested comment posts a private comment (existing comment rules). Save grade as draft uses the grade panel's draft save. Mark as reviewed is stored per Submission (`submissions.reviewed_at`).

## Migration
`supabase/migrations/20261106000000_submission_reviewed.sql` adds nullable `reviewed_at`. Additive; applied to the project database.

## Verification
Rendered with Playwright at 1440 and 390 from a throwaway harness page with mock data (not committed): [review 1440](review-1440.png), [sheet 1440](insights-sheet-1440.png), [review 390](review-390.png), [sheet 390](insights-sheet-390.png). No horizontal overflow at either width. Frames 114:1757 and 115:1737.
The live Gemini call and the signed-in flow were not exercised locally (no key or Google sign-in). Tests cover the actions with Prisma and Gemini mocked.
`npx tsc --noEmit` and lint pass. 23 test files that need a real database fail identically on `main` here (no local database); everything else passes.

## Deviations from Figma
- "Ask her to explain her code" and other copy use "{first name}" and "their", since pronouns are not stored.
- Mobile activity card shows the same log wording and clock format as desktop (frame trims "PM" and shortens the paste line).
- The sheet's log merges open and typing into one line and omits test runs, as in the frame; "hint level" on the tutor line is omitted because it is not recorded.
- Mobile bottom bar keeps the existing Comment and Return buttons; the sheet's backdrop uses 30% black (frame 32%).
- Open similarity check goes to the compare view when a 80%+ match exists, otherwise to the Post's submissions list.
