# Multiple-choice Items — #96

Instructors can add multiple-choice Items to a saved Post, edit the prompt/options/key/points, read them and delete unstarted Items. Students select one option, change it, autosave through the existing per-Item draft path and turn in a mixed Post atomically. The chosen option is stored as its zero-based index in the existing answer payload. Option order/text and the answer key lock after any Student work starts, preserving that identity. Instructor review displays the chosen option, correct option and automatic score. Student responses never contain the key or an unreleased automatic score.

## Validation

- A regression test changes the answer key between initial read and Post lock. Draft saving and turn-in reject stale Item configuration under the lock. Authoring controls freeze during save to preserve the saved snapshot.
- Pure scoring tests cover full credit, wrong, unanswered and noncanonical selections.
- Mocked actions cover choice creation/update, started-work locks, draft changes, invalid selections, permissions, turn-in scoring and answer-key privacy.
- TypeScript, Prisma validation and production build pass. Lint has only the two existing warnings in `app/layout.tsx` and `lib/encryption.ts`; build retains the existing tokenizer tracing warning.
- The first full-suite invocation lacked `DATABASE_URL`; integration tests could not connect. A disposable local PostgreSQL database was then created from the legacy schema and all migrations for a valid full-suite run: **86 files and all 490 tests pass**.

## Migration

`20261105193802_multiple_choice_items` adds `multiple_choice` to `ItemKind`, options and a nullable correct-option index. A database constraint checks the key is in range and Coding Items have no choice configuration. Existing Item RLS without direct client policies is retained; authenticated server actions enforce Class roles.

Applied and recorded in the configured database: 15 Items, 1 draft and 0 Submissions retained unchanged. Valid/invalid keys were checked using a temporary table. Enum addition commits before statements reference the value, as PostgreSQL requires. Deploy the migration before the application.

## Figma status and deviations

Read high-fidelity context and screenshots for all four frames: 93:1719, 93:1844, 95:1811 and 95:2053. Downloaded the selected-option asset and reused shadcn RadioGroup installed through its CLI.

**Required 1440px/390px running-page comparisons remain unverified.** The Browser runtime reports no available browsers (its discovery list is empty). No screenshots or pixel-match claims are supplied. Keep this PR in draft and do not merge until those comparisons and browser flows are completed.

Known layout/flow differences requiring follow-up:

- Existing Coding authoring remains above the added multiple-choice editor rather than sharing the Figma unified accordion. A new Post must first be saved as a draft to obtain its ID before adding multiple-choice Items.
- The Add item menu only offers Multiple choice in this change. File import and Short answer belong to other tickets; existing Coding authoring remains available.
- Multiple-choice points are summarized separately from the existing Coding summary; the full Post form preview still previews the existing Coding Item. Each multiple-choice editor has its own Student preview.
- Desktop multiple-choice workspace uses the Class context; its global shell differs from the existing Coding workspace. Dynamic titles, roster/Item counts and point values replace the Figma sample content. The mobile OS status bar is not drawn in the web page.
- Authoring preview is responsive and moves below the editor at narrower widths. The desktop matching and mobile wrapping still need visual verification.

## Review

Two independent code-review axes checked the diff from `913e7d6`. See [review findings](review.md). Correctness and input-validation findings were fixed and verified. The custom workspace shell and incomplete authoring/visual fidelity remain draft blockers. Copilot review was requested; GitHub reports insufficient remaining quota for that review.
