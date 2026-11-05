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

## Playwright follow-up review

Follow-up fixed point: `69b71f4`; implementation: `07d187e`. Both axes reviewed the new diff independently.

### Standards

No blocking findings. The prior shell violation is resolved: the workspace now reuses the existing `TopBar` and CLI-installed shadcn `Sidebar` through `DashboardSessionProvider`. Item loading/mutations, rows, menu, editor, preview and navigation have focused files under 200 lines. Save-time controls remain disabled and completion reuses `itemComplete`. The string-based selection representation remains a nonblocking design judgment.

Standards: **0 blocking findings**.

### Spec

No new blocking findings. Unified authoring preserves Coding form state, blocks Post persistence while a choice Item is unfinished, prevents switching away from an active choice editor and freezes controls during writes. CRUD updates the list and clears editing state; totals and preview include the active draft. Existing key-race and privacy protections are retained.

The documented Playwright flows and all four comparisons resolve the previous visual-verification blocker. Differences are explicitly listed with reasons. No scope creep found.

Spec: **0 blocking findings**.

Production build completed successfully after both reviews were requested. Typecheck, lint and all 490 tests pass. Earlier draft blockers above are superseded by this follow-up.
