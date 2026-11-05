# Code review — #95

Fixed point: `e58bbd28cfd9c0b808c0f1ea0206aa70bc2bdc13`. Implementation: `1288161`; corrections: `7d65722`. Standards and Spec reviews ran independently through the repository's code-review workflow.

## Standards

Initial review found native selection controls contrary to shadcn requirements, duplicated/inconsistent percentage conversion for fractional totals, and grade-dependent badge checks using unreleased automatic scores.

Final reviewer report:

> All reported findings are resolved:
>
> - Selects and checkboxes now use shadcn/ui.
> - Percentage calculations share `gradePercent`, including fractional totals and zero handling.
> - Perfect-score badges count only Returned final grades, with a regression test.
> - Unsubmit snapshots preserve the original Submission data behind Instructor authorization.
>
> No remaining material Standards findings in `1288161...7d65722`.

## Spec

Initial review found that Unsubmit retained code but discarded original test/activity evidence, and that cumulative hearts spending was compared with a per-Item limit.

Final reviewer report:

> Both findings are resolved in `7d65722`.
>
> - Unsubmit archives the complete Submission and its answers transactionally before deletion, preserving scores, test results, timestamps and behavioral evidence. History is available only to the Class's Instructor; direct client access is revoked.
> - Hearts summaries now show cumulative spending without the incompatible per-Item denominator.
>
> The added tests cover snapshot preservation and history authorization. No remaining material spec issues found in the fixes.

Remaining findings: Standards 0; Spec 0.
