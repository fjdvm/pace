# AI import of Items from a file — #99

An Instructor opens Create → Import from file on a Class, uploads a PDF, Word file or photo (up to 20 MB), picks Activity type, Language and the test/answer-key toggles, and Gemini extracts Items into an editable draft with **From file** and **Check this** marks and a source-file panel. Nothing is visible to Students until Assign. Uses the system key `GOOGLE_GENERATIVE_AI_API_KEY`; no key UI. No database migration is needed: marks live in the review state and Save draft stores ordinary Items.

## Verification

- Screens rendered with Playwright at 1440 and 390 (upload, reading, review) from a throwaway harness page (not committed) and compared with frames 92:1517, 92:1587, 93:1551, 95:1890, 95:1943. No horizontal overflow at 390.
- The live Gemini call and signed-in flow were not exercised: no Gemini key or Google sign-in is available locally. The Gemini call is stubbed in tests; server actions are tested with Prisma mocked.

## Deviations from Figma

- Reading screen shows generic skeleton paper and four timed stages; one server call has no per-stage progress, and there is no OCR step (Gemini reads the file). The "you will get a notification" copy became "keep this page open".
- Uploaded-file row omits page count (known only after extraction); the source panel lists each Item's extracted source text, not a rendered page.
- Assign publishes with a default due date 7 days out; no due-date field exists in these frames. Edit it afterwards in the Post form. Save draft opens that form.
- The review Settings card (For / Due / toggles) is not shown; the header carries Save draft and Assign on mobile too, since the acceptance criteria need both.
- Mobile entry uses the responsive upload page plus the "Add items" sheet in review; its photo/file rows return to the upload step.
- Multiple choice without a detected key defaults to option 1 and is flagged Check this, because the database requires a key.
