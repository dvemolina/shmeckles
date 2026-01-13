/**
 * Seed data for initial setup
 * Inserts default categories and sample accounts
 */

import type { SQLiteDBConnection } from '@capacitor-community/sqlite';

// ============================================================================
// SEED DATA
// ============================================================================

interface SeedCategory {
	id: string;
	name: string;
	type: 'expense' | 'income';
	color: string;
	icon: string;
	is_system: boolean;
	sort_order: number;
}

interface SeedAccount {
	id: string;
	name: string;
	type: 'checking' | 'savings' | 'cash' | 'credit' | 'other';
	currency: string;
	initial_balance_minor: number;
	color: string;
	icon: string;
}

// Default expense categories
const expenseCategories: SeedCategory[] = [
	{ id: 'cat-exp-food', name: 'Food & Dining', type: 'expense', color: '#FF6B6B', icon: '🍔', is_system: true, sort_order: 1 },
	{ id: 'cat-exp-transport', name: 'Transportation', type: 'expense', color: '#4ECDC4', icon: '🚗', is_system: true, sort_order: 2 },
	{ id: 'cat-exp-shopping', name: 'Shopping', type: 'expense', color: '#95E1D3', icon: '🛍️', is_system: true, sort_order: 3 },
	{ id: 'cat-exp-entertainment', name: 'Entertainment', type: 'expense', color: '#F38181', icon: '🎬', is_system: true, sort_order: 4 },
	{ id: 'cat-exp-bills', name: 'Bills & Utilities', type: 'expense', color: '#AA96DA', icon: '💡', is_system: true, sort_order: 5 },
	{ id: 'cat-exp-health', name: 'Healthcare', type: 'expense', color: '#FCBAD3', icon: '🏥', is_system: true, sort_order: 6 },
	{ id: 'cat-exp-personal', name: 'Personal Care', type: 'expense', color: '#A8D8EA', icon: '💆', is_system: true, sort_order: 7 },
	{ id: 'cat-exp-education', name: 'Education', type: 'expense', color: '#FFD93D', icon: '📚', is_system: true, sort_order: 8 },
	{ id: 'cat-exp-home', name: 'Home & Garden', type: 'expense', color: '#6BCB77', icon: '🏠', is_system: true, sort_order: 9 },
	{ id: 'cat-exp-other', name: 'Other Expenses', type: 'expense', color: '#B4B4B8', icon: '📦', is_system: true, sort_order: 10 }
];

// Default income categories
const incomeCategories: SeedCategory[] = [
	{ id: 'cat-inc-salary', name: 'Salary', type: 'income', color: '#51CF66', icon: '💰', is_system: true, sort_order: 1 },
	{ id: 'cat-inc-freelance', name: 'Freelance', type: 'income', color: '#74C0FC', icon: '💼', is_system: true, sort_order: 2 },
	{ id: 'cat-inc-investment', name: 'Investments', type: 'income', color: '#FFD43B', icon: '📈', is_system: true, sort_order: 3 },
	{ id: 'cat-inc-gift', name: 'Gifts', type: 'income', color: '#FF8787', icon: '🎁', is_system: true, sort_order: 4 },
	{ id: 'cat-inc-other', name: 'Other Income', type: 'income', color: '#B4B4B8', icon: '💵', is_system: true, sort_order: 5 }
];

// Sample accounts
const sampleAccounts: SeedAccount[] = [
	{
		id: 'acc-checking',
		name: 'Checking Account',
		type: 'checking',
		currency: 'USD',
		initial_balance_minor: 100000, // $1000.00
		color: '#4ECDC4',
		icon: '🏦'
	},
	{
		id: 'acc-cash',
		name: 'Cash',
		type: 'cash',
		currency: 'USD',
		initial_balance_minor: 5000, // $50.00
		color: '#95E1D3',
		icon: '💵'
	}
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

/**
 * Check if database has already been seeded
 */
async function isSeeded(db: SQLiteDBConnection): Promise<boolean> {
	try {
		const result = await db.query('SELECT COUNT(*) as count FROM categories;');
		if (result.values && result.values.length > 0) {
			const count = result.values[0].count as number;
			return count > 0;
		}
		return false;
	} catch (error) {
		console.error('[Seed] Error checking if seeded:', error);
		return false;
	}
}

/**
 * Seed default categories
 */
async function seedCategories(db: SQLiteDBConnection): Promise<void> {
	const now = Date.now();
	const allCategories = [...expenseCategories, ...incomeCategories];

	console.log(`[Seed] Inserting ${allCategories.length} default categories...`);

	for (const cat of allCategories) {
		await db.execute(
			`INSERT INTO categories (id, name, type, color, icon, parent_id, is_system, sort_order, created_at, updated_at, deleted_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
			[
				cat.id,
				cat.name,
				cat.type,
				cat.color,
				cat.icon,
				null, // parent_id
				cat.is_system ? 1 : 0,
				cat.sort_order,
				now,
				now,
				null
			]
		);
	}

	console.log('[Seed] ✅ Categories seeded');
}

/**
 * Seed sample accounts
 */
async function seedAccounts(db: SQLiteDBConnection): Promise<void> {
	const now = Date.now();

	console.log(`[Seed] Inserting ${sampleAccounts.length} sample accounts...`);

	for (const acc of sampleAccounts) {
		await db.execute(
			`INSERT INTO accounts (id, name, type, currency, initial_balance_minor, color, icon, notes, is_archived, created_at, updated_at, deleted_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
			[
				acc.id,
				acc.name,
				acc.type,
				acc.currency,
				acc.initial_balance_minor,
				acc.color,
				acc.icon,
				null, // notes
				0, // is_archived
				now,
				now,
				null
			]
		);
	}

	console.log('[Seed] ✅ Accounts seeded');
}

/**
 * Run all seed operations
 */
export async function seedDatabase(db: SQLiteDBConnection): Promise<void> {
	console.log('[Seed] Starting seed check...');

	// Check if already seeded
	const alreadySeeded = await isSeeded(db);
	if (alreadySeeded) {
		console.log('[Seed] Database already seeded, skipping');
		return;
	}

	console.log('[Seed] Running seed operations...');

	try {
		await seedCategories(db);
		await seedAccounts(db);
		console.log('[Seed] ✅ Database seeded successfully');
	} catch (error) {
		console.error('[Seed] ❌ Seed failed:', error);
		throw new Error(`Seed failed: ${error instanceof Error ? error.message : String(error)}`);
	}
}
