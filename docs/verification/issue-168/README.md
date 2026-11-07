# Issue 168 verification

The Instructor selects a supported file, sees continuing reading feedback, retries a failure, and reaches editable review. Teaching and Enrolled cards display real review and to-do counts.

- Figma: desktop frames `92:1517`, `92:1587`; mobile Add items sheet `95:1890`.
- Playwright: upload, rejection, retained selection, reading after 19 seconds, retry, review and card counts at 1440 and 390. The mobile check exercises the camera input with `capture="environment"`.
- Browser tests use the existing mock auth and real Postgres fixtures. Extraction responses are intercepted in the browser to test waiting, failure and success deterministically without calling a paid model.
- Vitest action integration tests use real Postgres ownership and a real DOCX parser, mocking only auth and the external AI call. They cover PDF/JPG/PNG/DOCX, invalid files, permission denial, retry and no publishing during extraction.
- Full Vitest suite: 112 files, 558 tests passed with `--maxWorkers=2 --testTimeout=15000`. Default parallelism exhausted the shared database pool; its 5-second default also timed out an existing manual-item integration test. The final run limits concurrency and allows network database latency.
- Affected Playwright suites: 8 tests passed (`ai-import`, `home`, `manual-items`), using one worker and the local mock-auth URL.
- `npx tsc --noEmit`, targeted ESLint and `git diff --check` passed.
- Code review: no documented standards violations; one nonblocking duplication observation about the two mobile choice sheets. The spec review's camera action finding was fixed and re-reviewed.
- No database migration is required.

The extractor cannot provide live OCR, per-stage counts or durable background notifications. These gaps and the resulting honest UI copy are recorded in [the required issue comment](https://github.com/fjdvm/pace/issues/168#issuecomment-6709497127). Existing header controls and the editor visible behind the mobile sheet remain application components.

Screenshots in this directory show selected upload, reading, mobile Add items, Teaching and Enrolled states. File sizes, elapsed time, names and counts come from test fixtures rather than Figma's sample data.
