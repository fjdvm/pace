# Code review — #96

Fixed point: `913e7d6`; initial implementation: `6641bf0`. Standards and Spec were reviewed by independent agents.

## Standards

- **Hard violation:** `choice-workspace.tsx` builds a custom header/sidebar rather than reusing the existing shadcn shell/templates required by AGENTS.md. Remains a draft blocker.
- **Possible Repeated Switches / Duplicated Code:** Item-kind labels and completion checks recur across the workspace, summary, confirmation and review. The concrete empty-test inconsistency was fixed by using `itemComplete`; repeated presentation labels remain a nonblocking judgment call.
- **Possible Primitive Obsession:** selections use strings in the existing `code` payload and integer option indices. Stable options are protected by the started-work lock and under-lock configuration check. A richer answer type remains a possible future improvement.
- **Correctness:** editing controls remained writable while a request saved an earlier snapshot, so later changes could be lost. Fixed by disabling prompt/options/key/points and option add/remove while busy. Reviewer verified the correction.

Standards: 1 remaining hard violation and 2 nonblocking smell judgments. The save-time edit-loss risk is resolved.

## Spec

- “Once a Student has started … its kind or answer key cannot change.” The first save/turn-in could read and validate old choices before obtaining the Post lock. Fixed by re-reading ordered Items inside the lock and rejecting changed configuration before persisting. A mocked regression test covers both actions.
- “Authoring and answering screens match the frames” and “Each frame is compared side by side with the running page.” Remains incomplete: no browser is available; known authoring layout/summary/preview differences are listed in README.md. Draft blocker.
- “New server actions and pure logic are covered by tests.” Initial direct pure tests did not cover authoring validation. Fixed with option-cardinality, blank-option, integer/range key, points and blank-prompt tests.

No scope creep found. Core scoring, key privacy, role-checked CRUD and review rendering appear implemented.

Spec: 1 remaining finding; Figma fidelity/comparisons are the blocker. Correctness and validation gaps are resolved. All 490 tests pass after corrections.
