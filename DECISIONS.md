# Decisions (do not change without explicit discussion)

## Stack
- SvelteKit UI + Capacitor wrapper (iOS + Android)
- Local DB: SQLite via @capacitor-community/sqlite
- ORM: Drizzle
- Self-hosting: future Postgres on own server (sync/backup later)

## Data rules
- IDs: UUID strings everywhere (TEXT in SQLite; uuid in Postgres later)
- Money: integer minor units `amount_minor` (no floats)
- Dates:
  - transactions.date = YYYY-MM-DD (local date)
  - created_at/updated_at/deleted_at = epoch ms integers
- Soft delete: deleted_at nullable on all tables
- Sync-ready: all tables have created_at, updated_at, deleted_at

## Transaction semantics
- `amount_minor` always positive
- Meaning comes from `type`:
  - expense: subtract from account_id
  - income: add to account_id
  - transfer: subtract from account_id AND add to to_account_id
- Transfers represented as a single row with to_account_id

## MVP scope
- No auth
- No bank sync
- Must support export/import JSON (Phase 3.5) before building server sync
