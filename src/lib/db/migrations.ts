/**
 * Migration system for on-device SQLite
 * Tracks and runs migrations in order
 */

import type { SQLiteDBConnection } from '@capacitor-community/sqlite';

export interface Migration {
	version: number;
	name: string;
	up: string[]; // Array of SQL statements
}

// ============================================================================
// MIGRATIONS
// ============================================================================

export const migrations: Migration[] = [
	{
		version: 1,
		name: 'initial_schema',
		up: [
			// Migration tracking table
			`CREATE TABLE IF NOT EXISTS _migrations (
				version INTEGER PRIMARY KEY,
				name TEXT NOT NULL,
				applied_at INTEGER NOT NULL
			);`,

			// Accounts table
			`CREATE TABLE accounts (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'cash', 'credit', 'other')),
				currency TEXT NOT NULL DEFAULT 'USD',
				initial_balance_minor INTEGER NOT NULL DEFAULT 0,
				color TEXT,
				icon TEXT,
				notes TEXT,
				is_archived INTEGER NOT NULL DEFAULT 0,
				created_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
				deleted_at INTEGER
			);`,
			`CREATE INDEX accounts_deleted_at_idx ON accounts(deleted_at);`,
			`CREATE INDEX accounts_is_archived_idx ON accounts(is_archived);`,

			// Categories table
			`CREATE TABLE categories (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
				color TEXT,
				icon TEXT,
				parent_id TEXT REFERENCES categories(id),
				is_system INTEGER NOT NULL DEFAULT 0,
				sort_order INTEGER NOT NULL DEFAULT 0,
				created_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
				deleted_at INTEGER
			);`,
			`CREATE INDEX categories_deleted_at_idx ON categories(deleted_at);`,
			`CREATE INDEX categories_type_idx ON categories(type);`,
			`CREATE INDEX categories_parent_id_idx ON categories(parent_id);`,

			// Transactions table
			`CREATE TABLE transactions (
				id TEXT PRIMARY KEY,
				type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer')),
				amount_minor INTEGER NOT NULL,
				account_id TEXT NOT NULL REFERENCES accounts(id),
				to_account_id TEXT REFERENCES accounts(id),
				category_id TEXT REFERENCES categories(id),
				date TEXT NOT NULL,
				payee TEXT,
				notes TEXT,
				tags TEXT,
				recurring_rule_id TEXT,
				planned_instance_id TEXT,
				created_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
				deleted_at INTEGER
			);`,
			`CREATE INDEX transactions_deleted_at_idx ON transactions(deleted_at);`,
			`CREATE INDEX transactions_account_id_idx ON transactions(account_id);`,
			`CREATE INDEX transactions_to_account_id_idx ON transactions(to_account_id);`,
			`CREATE INDEX transactions_category_id_idx ON transactions(category_id);`,
			`CREATE INDEX transactions_date_idx ON transactions(date);`,
			`CREATE INDEX transactions_type_idx ON transactions(type);`,

			// Recurring rules table (Phase 4)
			`CREATE TABLE recurring_rules (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer')),
				amount_minor INTEGER NOT NULL,
				account_id TEXT NOT NULL REFERENCES accounts(id),
				to_account_id TEXT REFERENCES accounts(id),
				category_id TEXT REFERENCES categories(id),
				rrule TEXT NOT NULL,
				start_date TEXT NOT NULL,
				end_date TEXT,
				is_active INTEGER NOT NULL DEFAULT 1,
				payee TEXT,
				notes TEXT,
				tags TEXT,
				created_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
				deleted_at INTEGER
			);`,
			`CREATE INDEX recurring_rules_deleted_at_idx ON recurring_rules(deleted_at);`,
			`CREATE INDEX recurring_rules_account_id_idx ON recurring_rules(account_id);`,
			`CREATE INDEX recurring_rules_is_active_idx ON recurring_rules(is_active);`,

			// Planned payments table (Phase 4)
			`CREATE TABLE planned_payments (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer')),
				amount_minor INTEGER NOT NULL,
				account_id TEXT NOT NULL REFERENCES accounts(id),
				to_account_id TEXT REFERENCES accounts(id),
				category_id TEXT REFERENCES categories(id),
				due_date TEXT NOT NULL,
				is_paid INTEGER NOT NULL DEFAULT 0,
				payee TEXT,
				notes TEXT,
				tags TEXT,
				created_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
				deleted_at INTEGER
			);`,
			`CREATE INDEX planned_payments_deleted_at_idx ON planned_payments(deleted_at);`,
			`CREATE INDEX planned_payments_account_id_idx ON planned_payments(account_id);`,
			`CREATE INDEX planned_payments_due_date_idx ON planned_payments(due_date);`,
			`CREATE INDEX planned_payments_is_paid_idx ON planned_payments(is_paid);`,

			// Planned instances table (Phase 4)
			`CREATE TABLE planned_instances (
				id TEXT PRIMARY KEY,
				planned_payment_id TEXT NOT NULL REFERENCES planned_payments(id),
				due_date TEXT NOT NULL,
				amount_minor INTEGER NOT NULL,
				is_paid INTEGER NOT NULL DEFAULT 0,
				transaction_id TEXT REFERENCES transactions(id),
				created_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
				deleted_at INTEGER
			);`,
			`CREATE INDEX planned_instances_deleted_at_idx ON planned_instances(deleted_at);`,
			`CREATE INDEX planned_instances_planned_payment_id_idx ON planned_instances(planned_payment_id);`,
			`CREATE INDEX planned_instances_due_date_idx ON planned_instances(due_date);`,
			`CREATE INDEX planned_instances_is_paid_idx ON planned_instances(is_paid);`
		]
	}
];

// ============================================================================
// MIGRATION RUNNER
// ============================================================================

/**
 * Run all pending migrations
 */
export async function runMigrations(db: SQLiteDBConnection): Promise<void> {
	console.log('[Migrations] Starting migration check...');

	// Get current migration version
	let currentVersion = 0;
	try {
		const result = await db.query('SELECT MAX(version) as version FROM _migrations;');
		if (result.values && result.values.length > 0 && result.values[0].version) {
			currentVersion = result.values[0].version as number;
		}
	} catch (error) {
		// _migrations table doesn't exist yet, that's ok
		console.log('[Migrations] No migration table found, starting from scratch');
	}

	console.log(`[Migrations] Current version: ${currentVersion}`);

	// Find pending migrations
	const pendingMigrations = migrations.filter((m) => m.version > currentVersion);

	if (pendingMigrations.length === 0) {
		console.log('[Migrations] No pending migrations');
		return;
	}

	console.log(`[Migrations] Found ${pendingMigrations.length} pending migration(s)`);

	// Run each pending migration
	for (const migration of pendingMigrations) {
		console.log(`[Migrations] Running migration ${migration.version}: ${migration.name}`);

		try {
			// Execute all SQL statements in the migration
			for (const sql of migration.up) {
				await db.execute(sql);
			}

			// Record migration as applied
			await db.execute(
				`INSERT INTO _migrations (version, name, applied_at) VALUES (?, ?, ?);`,
				[migration.version, migration.name, Date.now()]
			);

			console.log(`[Migrations] ✅ Migration ${migration.version} completed`);
		} catch (error) {
			console.error(`[Migrations] ❌ Migration ${migration.version} failed:`, error);
			throw new Error(
				`Migration ${migration.version} (${migration.name}) failed: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	console.log('[Migrations] All migrations completed successfully');
}
