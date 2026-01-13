# Personal Finance Tracker — Project Spec

## Current status (update every phase)
- Current phase: Phase 0 (Setup)
- Last completed phase: —
- Next up: Phase 1 (Schema + migrations)
- Build targets: iOS + Android (Capacitor)
- Local DB: SQLite (@capacitor-community/sqlite) + Drizzle
- Known issues / blockers:
  - (none)

## Goal
Offline-first mobile app (iOS + Android) for ultra-fast daily expense tracking.

## Non-negotiable Requirements
- SvelteKit + Capacitor (single codebase)
- SQLite on-device via @capacitor-community/sqlite
- Drizzle ORM
- UUID string IDs everywhere
- Money stored as integer minor units: `amount_minor` (NO floats)
- Every table includes: `created_at`, `updated_at`, `deleted_at` (nullable), epoch ms
- Transaction date stored as `YYYY-MM-DD` text (local date)
- Repo/service architecture: UI never calls SQL directly
- MVP: no auth, no bank sync
- Transfers: `type='transfer'` with `account_id` (from) + `to_account_id` (to)

## Commands (keep updated)
### Dev
- Install: `pnpm i`
- Web dev: `pnpm dev`
- Build web: `pnpm build`

### Capacitor
- Sync native: `npx cap sync`
- iOS open: `npx cap open ios`
- Android open: `npx cap open android`

## Phase plan

### Phase 0 — Capacitor + SQLite Setup
Status: NOT STARTED
Acceptance criteria:
- Capacitor configured for iOS + Android
- SQLite plugin installed and a DB init function exists (on-device)
- App runs and can open DB without crashing
- Documented commands to run + build

Implementation notes:
- (fill in)

Files changed:
- (fill in)

---

### Phase 1 — Drizzle schema + migrations
Status: NOT STARTED
Acceptance criteria:
- Drizzle schema created for all tables (accounts, categories, transactions, recurring/planned)
- Initial migration created + runs on device
- Seed script inserts default categories + sample accounts

Implementation notes:
- (fill in)

Files changed:
- (fill in)

---

### Phase 2 — Repo layer
Status: NOT STARTED
Acceptance criteria:
- accountsRepo, categoriesRepo, transactionsRepo exist
- Derived balances implemented (incl. transfers)
- Filters/search implemented for listing transactions

Implementation notes:
- (fill in)

Files changed:
- (fill in)

---

### Phase 3 — MVP UI
Status: NOT STARTED
Acceptance criteria:
- /add quick add works (AmountPad + defaults + undo)
- /transactions list with month switcher + filters
- /accounts list + /accounts/[id] detail
- /analytics basic monthly summaries

Implementation notes:
- (fill in)

Files changed:
- (fill in)

---

### Phase 3.5 — Export/Import Backup
Status: NOT STARTED
Acceptance criteria:
- /settings export JSON (includes schemaVersion, exportedAt)
- import JSON supports merge and replace
- validation + success/error toasts

Implementation notes:
- (fill in)

Files changed:
- (fill in)

---

### Phase 4 — Recurring + Planned
Status: NOT STARTED
Acceptance criteria:
- recurring rules store RRULE and generate instances next 60 days
- planned payments + instances
- marking paid creates/links transactions

Implementation notes:
- (fill in)

Files changed:
- (fill in)

---

## Changelog (append-only)
### YYYY-MM-DD — Phase X — Title
- Summary:
  - …
- Key decisions:
  - …
- Notes:
  - …

## Known issues / blockers (keep updated)
- (none)

## Next steps (keep updated)
- Start Phase 0: Capacitor + on-device SQLite init
