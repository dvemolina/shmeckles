/**
 * Drizzle ORM schema for on-device SQLite database
 * All tables include: id (UUID), created_at, updated_at, deleted_at (epoch ms)
 */

import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';

// ============================================================================
// ACCOUNTS
// ============================================================================

export const accounts = sqliteTable('accounts', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	type: text('type', { enum: ['checking', 'savings', 'cash', 'credit', 'other'] }).notNull(),
	currency: text('currency').notNull().default('USD'),
	initial_balance_minor: integer('initial_balance_minor').notNull().default(0),
	color: text('color'), // hex color for UI
	icon: text('icon'), // icon name/emoji for UI
	notes: text('notes'),
	is_archived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
	created_at: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updated_at: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
	deleted_at: integer('deleted_at', { mode: 'timestamp_ms' })
}, (table) => ({
	deletedAtIdx: index('accounts_deleted_at_idx').on(table.deleted_at),
	isArchivedIdx: index('accounts_is_archived_idx').on(table.is_archived)
}));

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

// ============================================================================
// CATEGORIES
// ============================================================================

export const categories = sqliteTable('categories', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	type: text('type', { enum: ['expense', 'income'] }).notNull(),
	color: text('color'), // hex color for UI
	icon: text('icon'), // icon name/emoji for UI
	parent_id: text('parent_id').references((): any => categories.id), // for subcategories
	is_system: integer('is_system', { mode: 'boolean' }).notNull().default(false), // can't delete system categories
	sort_order: integer('sort_order').notNull().default(0),
	created_at: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updated_at: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
	deleted_at: integer('deleted_at', { mode: 'timestamp_ms' })
}, (table) => ({
	deletedAtIdx: index('categories_deleted_at_idx').on(table.deleted_at),
	typeIdx: index('categories_type_idx').on(table.type),
	parentIdIdx: index('categories_parent_id_idx').on(table.parent_id)
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

// ============================================================================
// TRANSACTIONS
// ============================================================================

export const transactions = sqliteTable('transactions', {
	id: text('id').primaryKey(),
	type: text('type', { enum: ['expense', 'income', 'transfer'] }).notNull(),
	amount_minor: integer('amount_minor').notNull(), // always positive
	account_id: text('account_id').notNull().references(() => accounts.id),
	to_account_id: text('to_account_id').references(() => accounts.id), // only for transfers
	category_id: text('category_id').references(() => categories.id), // null for transfers
	date: text('date').notNull(), // YYYY-MM-DD local date
	payee: text('payee'),
	notes: text('notes'),
	tags: text('tags'), // JSON array of strings
	recurring_rule_id: text('recurring_rule_id').references((): any => recurringRules.id), // Phase 4
	planned_instance_id: text('planned_instance_id').references((): any => plannedInstances.id), // Phase 4
	created_at: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updated_at: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
	deleted_at: integer('deleted_at', { mode: 'timestamp_ms' })
}, (table) => ({
	deletedAtIdx: index('transactions_deleted_at_idx').on(table.deleted_at),
	accountIdIdx: index('transactions_account_id_idx').on(table.account_id),
	toAccountIdIdx: index('transactions_to_account_id_idx').on(table.to_account_id),
	categoryIdIdx: index('transactions_category_id_idx').on(table.category_id),
	dateIdx: index('transactions_date_idx').on(table.date),
	typeIdx: index('transactions_type_idx').on(table.type)
}));

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

// ============================================================================
// RECURRING RULES (Phase 4)
// ============================================================================

export const recurringRules = sqliteTable('recurring_rules', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	type: text('type', { enum: ['expense', 'income', 'transfer'] }).notNull(),
	amount_minor: integer('amount_minor').notNull(),
	account_id: text('account_id').notNull().references(() => accounts.id),
	to_account_id: text('to_account_id').references(() => accounts.id), // only for transfers
	category_id: text('category_id').references(() => categories.id),
	rrule: text('rrule').notNull(), // RFC 5545 RRULE string
	start_date: text('start_date').notNull(), // YYYY-MM-DD
	end_date: text('end_date'), // YYYY-MM-DD, null = no end
	is_active: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	payee: text('payee'),
	notes: text('notes'),
	tags: text('tags'), // JSON array of strings
	created_at: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updated_at: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
	deleted_at: integer('deleted_at', { mode: 'timestamp_ms' })
}, (table) => ({
	deletedAtIdx: index('recurring_rules_deleted_at_idx').on(table.deleted_at),
	accountIdIdx: index('recurring_rules_account_id_idx').on(table.account_id),
	isActiveIdx: index('recurring_rules_is_active_idx').on(table.is_active)
}));

export type RecurringRule = typeof recurringRules.$inferSelect;
export type NewRecurringRule = typeof recurringRules.$inferInsert;

// ============================================================================
// PLANNED PAYMENTS (Phase 4)
// ============================================================================

export const plannedPayments = sqliteTable('planned_payments', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	type: text('type', { enum: ['expense', 'income', 'transfer'] }).notNull(),
	amount_minor: integer('amount_minor').notNull(),
	account_id: text('account_id').notNull().references(() => accounts.id),
	to_account_id: text('to_account_id').references(() => accounts.id), // only for transfers
	category_id: text('category_id').references(() => categories.id),
	due_date: text('due_date').notNull(), // YYYY-MM-DD
	is_paid: integer('is_paid', { mode: 'boolean' }).notNull().default(false),
	payee: text('payee'),
	notes: text('notes'),
	tags: text('tags'), // JSON array of strings
	created_at: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updated_at: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
	deleted_at: integer('deleted_at', { mode: 'timestamp_ms' })
}, (table) => ({
	deletedAtIdx: index('planned_payments_deleted_at_idx').on(table.deleted_at),
	accountIdIdx: index('planned_payments_account_id_idx').on(table.account_id),
	dueDateIdx: index('planned_payments_due_date_idx').on(table.due_date),
	isPaidIdx: index('planned_payments_is_paid_idx').on(table.is_paid)
}));

export type PlannedPayment = typeof plannedPayments.$inferSelect;
export type NewPlannedPayment = typeof plannedPayments.$inferInsert;

// ============================================================================
// PLANNED INSTANCES (Phase 4)
// ============================================================================

export const plannedInstances = sqliteTable('planned_instances', {
	id: text('id').primaryKey(),
	planned_payment_id: text('planned_payment_id').notNull().references(() => plannedPayments.id),
	due_date: text('due_date').notNull(), // YYYY-MM-DD
	amount_minor: integer('amount_minor').notNull(),
	is_paid: integer('is_paid', { mode: 'boolean' }).notNull().default(false),
	transaction_id: text('transaction_id').references(() => transactions.id), // links to actual transaction when paid
	created_at: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updated_at: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
	deleted_at: integer('deleted_at', { mode: 'timestamp_ms' })
}, (table) => ({
	deletedAtIdx: index('planned_instances_deleted_at_idx').on(table.deleted_at),
	plannedPaymentIdIdx: index('planned_instances_planned_payment_id_idx').on(table.planned_payment_id),
	dueDateIdx: index('planned_instances_due_date_idx').on(table.due_date),
	isPaidIdx: index('planned_instances_is_paid_idx').on(table.is_paid)
}));

export type PlannedInstance = typeof plannedInstances.$inferSelect;
export type NewPlannedInstance = typeof plannedInstances.$inferInsert;
