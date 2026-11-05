# Ticket #93 verification

The workspace follows PACE frames 84:991, 84:1100, 84:1562, 87:1464 and 87:1531 in [Figma](https://www.figma.com/design/DkEUeJcwgYA7jklHsH6HpT/PACE?node-id=84-991).

## Visual comparison

Figma is on the left; the running application is on the right. Desktop screenshots are 1440 × 900. Mobile screenshots are 390 × 808; the comparison crops Figma's 36px operating-system status bar to compare application content at the same scale.

- [Desktop start](desktop-start-comparison.png)
- [Desktop test results](desktop-results-comparison.png)
- [Desktop confirmation](desktop-confirm-comparison.png)
- [Mobile Code](mobile-code-comparison.png)
- [Mobile Tests](mobile-tests-comparison.png)
- [Submitted workspace](desktop-submitted.png)

Intentional differences:

- The third fixture Item is Coding, rather than the design's Multiple choice Item: #91 implements only Coding. Every Item still appears in the strip and turn-in summary.
- Confirmation states that turn-in is final. #93 explicitly requires one-time turn-in; the design's unsubmit sentence would promise an unsupported action.
- Mobile omits the operating-system status bar and phone-frame corners. The title opens an Item selector; Tests adds an Instructions disclosure so Students can read instructions and navigate all Items on a phone.
- Dates, titles, code, hearts and tutor conversation reflect persisted data. The same source code is used on mobile and desktop, including its longer comment; the mobile mock abbreviates that comment. The confirmation screenshot uses the fixture's real test counts and conversation rather than inserting the design's sample tutor messages.
- Monaco supplies editing, syntax colors, cursor, scrolling and line-number geometry. The empty tutor composer disables Send rather than permitting an empty question.
- Desktop columns can be resized; default widths are 320px for instructions and 360px for the tutor. Separator boundaries can differ by one pixel from the static frame.

## Functional evidence

The browser exercised the real Next.js server actions and a migrated isolated PostgreSQL database. A local Auth fixture supplied a Student session. The Judge0 boundary was replaced with a local Python executor returning Judge0-shaped responses; no claim is made about external Judge0 availability.

Verified:

- Start and failed visible-test states on desktop and mobile, including individual outputs.
- Three independent Item drafts, autosave indicator, switching Items and restoration after reload.
- A direct Item link opens the selected Item; immediate browser Back flushes a dirty draft before leaving the workspace.
- Cancel creates no Submission; confirmation creates one Submission with three answers, clears drafts, and preserves read-only code after reload.
- The submitted Post disappears from To-do, and the Stream entry and upcoming-work calculation reflect the Submission.
- Browser emitted no page errors.
- The migration SQL check preserves legacy code, scores, results and drafts, supports multiple drafts in a Post, enables answer RLS, and verifies answer deletion with the parent Submission.

Checks: 71 test files / 428 tests passed; TypeScript passed; production build passed. ESLint passed with three existing warnings in app/layout.tsx, lib/encryption.ts and lib/gamification.ts.

The workspace migration was applied and recorded in the configured database as `20261104213442_workspace_answers`. Prisma reports no schema drift. The migration changes the draft primary key, so the corresponding application update must be deployed with it.

The independent Standards and Spec reviews found five issues; all were corrected and re-reviewed with no remaining blockers.
