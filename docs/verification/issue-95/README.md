# Submission grading and return — #95

A Student turns in a Post; its Instructor saves per-Item grades and private feedback, then returns one or several Submissions. Student pages disclose grades and feedback only after Return.

## Figma comparison

Compared every linked frame side by side with the running page. Desktop Student captures are 1440 × 900, Instructor 1440 × 960; mobile viewports are 390 × 808, corresponding to the 844px frames excluding their 36px OS status bar.

| Frame | Comparison |
| --- | --- |
| 85:1081 — Student, Turned in | [Desktop](student-turned-in-comparison.png) |
| 85:1207 — Student, Returned | [Desktop](student-returned-comparison.png) |
| 86:1519 — Instructor review | [Desktop](instructor-review-comparison.png) |
| 87:1655 — Student, Turned in | [Mobile](student-turned-in-mobile-comparison.png) |
| 87:1747 — Instructor review | [Mobile](instructor-review-mobile-comparison.png) |

[Returned mobile](student-returned-390.png) is also captured; the ticket supplies no separate mobile Returned frame.

Differences and reasons:

- Persisted titles, dates, roster counts, answers, tests, hearts, activity events and grades replace the sample data. The fixture has four Submissions, and the Instructor gives a final grade of 95/100 while retaining the automatic 100/100 Item scores. The same submitted code appears on both viewports, including its comment, unlike Figma's abbreviated mobile example.
- Item 3 remains Coding. The existing schema from #91 supports only Coding; this ticket does not add a Multiple choice or Short answer editor. The return validator explicitly rejects an ungraded Short answer and that rule has a direct pure test.
- “Until your work is graded” replaces “until the due date.” The acceptance criteria allow Unsubmit only while Turned in, including after the due date; late turn-in is accepted and Late is derived from the submission timestamp.
- An “Adjust Item scores” disclosure, Save draft grade, Delete draft grade and checkboxes for bulk return are added because the acceptance criteria require these interactions but the frames do not show controls for them. The mobile subtitle selects the Item; desktop uses the framed Item tabs.
- Insights opens the existing analysis, tests and tutor-chat panel. No fabricated count or “3 next steps” badge is shown. Student switching and Next Student use the actual roster.
- The existing dashboard canvas, wordmark, breadcrumb/sidebar contents and global feedback button differ from the supplied Student shell. They are outside the grading screen change. The feedback button remains visible in captures; the phone's OS status bar and outer hardware/frame radius are not drawn inside the website.
- Student hidden-test details and grades remain withheld until Returned. The pre-return summary shows visible test results and the hidden-test timing message; it omits the mockup's automatic “Test score” so an unreleased grade is not disclosed.

The new review screen uses the downloaded Figma back, chevron and code assets at 24 × 24. Existing assignment/sidebar assets are reused. Cards and input radii use explicit 8px/12px values because this repository's theme maps `rounded-lg` to 16px. The review code uses the existing JetBrains Mono setup.

## Verification

The browser ran the actual Next.js pages and server actions against an isolated local PostgreSQL database. A local Auth fixture supplied separate Student and Instructor sessions; no production session was forged or used for these checks.

- Unsubmit restored every Item answer byte-for-byte as a draft and retained hearts and chat records.
- Creating, updating and deleting draft grades retained the Submission and answers.
- A saved draft's grade and feedback were absent from Student screens, and Unsubmit was unavailable.
- Return persisted the final grade and feedback and made both visible to the Student.
- Selecting two Graded Submissions and returning the selection persisted both states.
- Browser page errors: none.
- Mocked-action tests cover authentication, Class Instructor authorization, foreign Submissions, invalid grades, locked states, all-or-nothing batch validation and unsubmit restoration.
- Pure tests cover due-date boundaries, grade privacy, ungraded Short answers and To-do Done/Missing state handling. A dashboard regression test verifies unreleased grades remain null.
- Full suite: 463 tests pass. TypeScript, Prisma validation, production build and lint pass; lint retains three pre-existing warnings.

## Migration

`20261105085230_submission_grading` adds Turned in / Graded / Returned state, final grade, feedback, return timestamp and optional per-Item grades. Existing rows default to Turned in and retain their automatic scores. Database checks reject non-finite grades and Returned rows without a grade/timestamp. Submission access remains through authenticated server code; direct `anon`, `authenticated` and `PUBLIC` privileges are revoked to prevent draft-grade disclosure.

The configured database migration was applied transactionally and recorded in Supabase history. There were no existing Submissions or answers; 8 hearts rows, 10 chat rows and 1 draft were retained. Prisma reports an empty schema diff. The local SQL migration fixture additionally verifies non-empty legacy Submission/answer preservation, default state, constraints and revoked client access.

Grading, unsubmit and return lock the same Post row used by turn-in and draft writes. Answers are restored before unsubmit deletes the Submission, within one transaction. Automatic test output is recomputed on the next turn-in; heart spending and tutor history remain intact. Grade-based XP and grade notifications are deferred until Return to avoid disclosing an unreleased score.
