# Personal Finance Tracker — Project Spec

## Current status (update every phase)
- Current phase: Phase 1 (Schema + migrations) - DONE
- Last completed phase: Phase 1 (Schema + migrations)
- Next up: Phase 2 (Repo layer)
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
Status: DONE
Acceptance criteria:
- ✅ Drizzle schema created for all tables (accounts, categories, transactions, recurring/planned)
- ✅ Initial migration created + runs on device
- ✅ Seed script inserts default categories + sample accounts

Implementation notes:
- Created comprehensive Drizzle schema (src/lib/db/schema.ts) for 6 tables:
  - accounts: banking/cash accounts with type, currency, initial_balance_minor
  - categories: expense/income categories with color, icon, parent_id for subcategories
  - transactions: all transactions (expense, income, transfer) with amount_minor always positive
  - recurring_rules: for Phase 4 (RRULE support for recurring transactions)
  - planned_payments: for Phase 4 (future planned transactions)
  - planned_instances: for Phase 4 (instances of planned payments)
- All tables include UUID string IDs, created_at/updated_at/deleted_at (epoch ms)
- All tables properly indexed for query performance
- Created migration system (src/lib/db/migrations.ts):
  - Tracks migrations in _migrations table
  - Runs migrations in order on device initialization
  - Migration #1 creates all tables with proper indexes and constraints
- Created seed system (src/lib/db/seed.ts):
  - 15 default categories (10 expense, 5 income) with colors and icons
  - 2 sample accounts (Checking: $1000, Cash: $50)
  - Idempotent - only seeds if database is empty
- Integrated migrations + seed into init.ts lifecycle
- Created UUID utility (src/lib/utils/uuid.ts) for generating IDs
- All money stored as integer minor units (amount_minor)
- Transaction dates stored as YYYY-MM-DD text
- Foreign keys enabled and enforced

Files changed:
- src/lib/db/schema.ts (created, Drizzle schema for all tables)
- src/lib/db/migrations.ts (created, migration runner and initial migration)
- src/lib/db/seed.ts (created, seed data for categories and accounts)
- src/lib/db/init.ts (modified, integrated migrations and seed)
- src/lib/utils/uuid.ts (created, UUID generation utility)

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
### 2026-01-13 — Phase 1 — Drizzle Schema + Migrations
- Summary:
  - Created comprehensive Drizzle schema for all 6 tables (accounts, categories, transactions, recurring_rules, planned_payments, planned_instances)
  - Built migration system that tracks and runs migrations on device initialization
  - Created seed system with 15 default categories and 2 sample accounts
  - Integrated migrations and seed into database initialization lifecycle
  - Created UUID utility for generating unique identifiers
- Key decisions:
  - All tables use UUID string IDs (TEXT in SQLite)
  - Money stored as integer minor units (amount_minor) - no floats
  - Transaction dates stored as YYYY-MM-DD text (local date)
  - created_at/updated_at/deleted_at (epoch ms integers) on all tables
  - Migrations stored as TypeScript strings (easier bundling for Capacitor)
  - Foreign keys enabled and enforced
  - Proper indexes on all frequently queried columns
- Notes:
  - Migration #1 creates all tables including Phase 4 tables (recurring, planned)
  - Seed data includes colorful categories with icons for better UX
  - Migration and seed systems are idempotent (safe to run multiple times)
  - Database is now ready for repo layer implementation

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
- Start Phase 2: Create repo layer for accounts, categories, and transactions
