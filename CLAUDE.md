# Claude Code Operating Rules

## Read-first
Before any coding or edits:
1) Read WORKFLOW.md, PROJECT_SPEC.md, DECISIONS.md, and this file.
2) Confirm the requested phase and do ONLY that phase.

## Non-negotiables (must follow)
- Use SvelteKit + Capacitor.
- Use SQLite via @capacitor-community/sqlite for on-device DB.
- Use Drizzle ORM.
- UUID string IDs everywhere.
- Money stored as integer minor units `amount_minor` only (no floats).
- Every table must include created_at, updated_at, deleted_at (nullable) epoch ms.
- UI must not call SQL directly; use repo/service layers.

## Phase workflow (mandatory)
- Work in phases: 0,1,2,3,3.5,4.
- BEFORE coding a phase:
  - Update PROJECT_SPEC.md: set that phase to IN PROGRESS.
  - Print acceptance criteria checklist.
- AFTER finishing a phase:
  - Update PROJECT_SPEC.md: set phase to DONE.
  - Fill in Implementation notes, Files changed, Commands (if new).
  - Append a Changelog entry at bottom (date + phase + summary).
  - Print: file tree changes and exact commands to run.
- Do NOT proceed to next phase until instructed.

## Output format
At the end of each phase response:
- ✅ Acceptance criteria met: …
- 📁 Files changed: …
- ▶️ Commands to run: …
- ⚠️ Known issues: …
