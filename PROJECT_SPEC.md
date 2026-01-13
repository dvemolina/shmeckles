# Personal Finance Tracker — Project Spec

## Current status (update every phase)
- Current phase: Phase 0 (Setup) - DONE
- Last completed phase: Phase 0 (Setup)
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
Status: DONE
Acceptance criteria:
- ✅ Capacitor configured for iOS + Android
- ✅ SQLite plugin installed and a DB init function exists (on-device)
- ✅ App runs and can open DB without crashing
- ✅ Documented commands to run + build

Implementation notes:
- Installed @capacitor/core, @capacitor/cli, @capacitor/ios, @capacitor/android, @capacitor-community/sqlite
- Switched from adapter-node to adapter-static (required for Capacitor)
- Initialized Capacitor with app ID "com.shmeckles.fintrack" and web directory "build"
- Added iOS and Android native platforms
- Created src/lib/db/init.ts with idempotent database initialization
- Database name: "fintrack", enables foreign keys, handles connection reuse
- Added client-side initialization in src/routes/+layout.svelte using onMount
- Initialization runs only on native platforms (not SSR or web browser)

Files changed:
- package.json (added Capacitor dependencies)
- svelte.config.js (switched to adapter-static)
- capacitor.config.ts (created, Capacitor configuration)
- src/lib/db/init.ts (created, database initialization)
- src/routes/+layout.svelte (added DB init on mount)
- ios/ (created, native iOS platform)
- android/ (created, native Android platform)

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
### 2026-01-13 — Phase 0 — Capacitor + SQLite Setup
- Summary:
  - Installed and configured Capacitor for iOS and Android
  - Added @capacitor-community/sqlite for on-device database
  - Created idempotent database initialization in src/lib/db/init.ts
  - Integrated DB init with SvelteKit lifecycle (client-side only)
- Key decisions:
  - Switched to adapter-static (required for Capacitor static file serving)
  - Database name: "fintrack"
  - Foreign keys enabled by default
  - Initialization skips SSR and web platforms (native-only)
- Notes:
  - better-sqlite3 remains in dependencies for potential server-side tooling
  - Platforms (ios/, android/) are gitignored per Capacitor best practices
  - Need to run `pnpm build && npx cap sync` before opening in Xcode/Android Studio

## Known issues / blockers (keep updated)
- (none)

## Next steps (keep updated)
- Start Phase 1: Create Drizzle schema and migrations for all tables
