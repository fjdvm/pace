# Short answer Items — #97

An Instructor adds a prompt and points to a saved Post. A Student writes and autosaves an answer, then turns in the Post. Short answers have no automatic score; only an Instructor enters points, including an explicit zero. The Student sees points and private feedback after Returned.

## Executed verification

Playwright exercised the real Next.js pages and server actions against disposable PostgreSQL and the existing local Auth fixture with separate Instructor and Student identities.

- Instructor created a Short answer, reloaded to read it, changed its points from 10 to 12, and created/deleted a temporary Item. Post totals updated correctly.
- Student typed an explanation, autosaved, reloaded, and recovered the same text. No horizontal overflow at 390px. Turn-in stored all four answers atomically; the Short answer had `score = NULL`, `grade = NULL`, and no test results. Reopening the submitted answer is read-only.
- Instructor review initially showed Ungraded and an empty Item grade. Return was rejected until an explicit grade was supplied. Pure/action tests additionally cover an explicit zero, invalid scores, unauthorized Users and changes after turn-in.
- Instructor saved 8/12 and private feedback. The Student saw neither before Returned; after Return the Student saw the resulting 8/72 Post grade and exact feedback. Incomplete grading drafts retain a blank final grade until all Items are graded, unless the Instructor explicitly supplies a final override.
- Typecheck, lint, Prisma validation, production build, and the full 505-test/88-file suite pass. Existing font/encryption lint warnings and tokenizer/Vite warnings remain. A pre-existing Base UI menu hydration warning appeared during local development; no functional browser error remained in the Short answer flow.

## Figma review flag and comparisons

**Flagged for Figma review before merge:** no dedicated Short answer authoring, answering, grading or mobile frame exists. These are intentional adaptations of the closest frames, not an exact Short answer design approval.

| Reference | Side-by-side comparison |
| --- | --- |
| 93:1551 — AI draft, Short answer Item 4 | [1440px](draft-comparison.png) |
| 93:1844 — manual Item authoring | [1440px](authoring-comparison.png) |
| 95:1811 — Student answer layout | [1440px](student-comparison.png) |
| 86:1519 — Instructor review | [1440px](review-comparison.png) |

Mobile adaptations were checked at 390px: [authoring](authoring-390.png), [answering](student-390.png), [review](review-390.png). Desktop captures: [authoring](authoring-1440.png), [answering](student-1440.png), [review](review-1440.png). Screenshots hide only the Next.js development indicator.

Design choices and deviations:

- Reuse Plus Jakarta Sans, existing PACE color tokens, 12px authoring cards/fields, 8px review-answer panel, 13px labels, 15px body, 22px answer heading, desktop 48px answer padding, and 16px mobile padding. Short answer uses the amber badge from Item 4, consistently across authoring, answering and the Student Item list.
- Manual authoring reuses the active green Item outline, points field, Delete/Done actions and live Student preview from 93:1844. A multiline Prompt and answer placeholder replace multiple-choice options because this Item accepts written text. The existing Post toolbar/settings and first Coding Item remain intact.
- The answering layout reuses the shared shadcn Sidebar and TopBar, Item navigation and bottom actions from 95:1811. A labeled multiline answer replaces the option list; save/read-only states and Instructor-grading copy replace choice-specific instructions. Mobile uses the existing responsive workspace shell; there is no matching Short answer mobile reference.
- Review replaces code/test output with the written answer and Ungraded/manual points state, retaining the existing Student list, activity panel and grade sidebar. Item score controls open automatically when a Short answer is present. Feedback remains the existing private Submission comment, released only on Return.
- No file-import controls or “From file” badges are fabricated for manually authored Items. Fixture text, points, timestamps, counts and Returned state replace the reference examples. Shared headers and activity panels retain pre-existing layout differences from the linked frames.

## Database

Migration `20261105200956_short_answer_items` adds the enum value, extends the existing Item answer-key constraint, and makes automatic answer scores nullable. It was exercised locally, then applied and recorded in the configured database. Snapshot hashes confirmed all 15 Items, 1 draft, and existing Submission/answer counts were preserved. The migration adds no table, grant, or RLS policy; existing role checks and policies continue to apply. Application rollback can retain the additive enum and nullable column.

## Independent review

Standards: initial decorative-icon finding resolved; repeated kind labels and ambiguous component names were also addressed. Follow-up found no blockers.

Spec: initial non-amber Short answer badges resolved in both answering and Student Item rows. Follow-up found no functional or permission blockers; visual comparisons and this Figma-review flag complete the requested release evidence.
