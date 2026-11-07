# Instructor Home — #162

Matches Figma desktop `80:381` and mobile `81:1028`: Class cards, enrollment counts, pending review summaries, review/classwork links, mobile actions and create-Class button. The product owner confirmed the linked frames take precedence over the ticket's older stat-card/join-pill wording; recorded on the issue. Join codes are available in the mobile Class menu and existing Class screen.

Review counts include unreviewed, turned-in Submissions to published Posts from Students currently enrolled in that Class. Graded, Returned, reviewed and Draft work is excluded. Shared Posts are counted separately for each Class's Students. No migration required.

## Verification

- `DATABASE_URL=<disposable Postgres> npm test`: 102 files, 518 tests passed.
- `npx tsc --noEmit`: passed after regenerating the Prisma Client.
- Targeted ESLint: passed.
- `DATABASE_URL=<disposable Postgres> npx playwright test -c playwright.instructor.config.ts`: 3 checks passed, including 1440/390 geometry/copy and creating a Class through the real dashboard/server action, then reloading to verify persistence.
- Browser auth extends the existing test mock-auth approach with a local Supabase user endpoint; no production auth bypass is added. Seeded rows are cleaned up.
- Screenshots: [desktop](home-1440.png), [mobile](home-390.png). OS status bar/device border in the mobile design are browser chrome, not application UI.
- Standards review: no actionable findings. Spec review identified the feedback button obstructing mobile creation and incomplete white background; both fixed and browser checks rerun.

Existing shared-shell differences remain: desktop logo, missing Calendar/Settings destinations, and feedback affordance. Mobile Home hides the floating feedback affordance to preserve the creation target.

The existing shadcn Card, Button, Dialog and DropdownMenu are reused; `npx shadcn add card button --yes` confirmed existing component files. Figma's four content/action SVGs are stored locally under `public/instructor-home`.
