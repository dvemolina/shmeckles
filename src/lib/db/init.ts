/**
 * On-device SQLite initialization for Capacitor
 * Uses @capacitor-community/sqlite for iOS/Android
 */

import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_NAME = 'fintrack';
let dbConnection: SQLiteDBConnection | null = null;
let sqliteConnection: SQLiteConnection | null = null;

/**
 * Initialize the SQLite database connection.
 * Safe to call multiple times (idempotent).
 * Only works on native platforms (iOS/Android).
 *
 * @returns Promise that resolves when DB is ready
 * @throws Error if initialization fails
 */
export async function initDB(): Promise<void> {
	// Only run on native platforms (not in SSR or web browser)
	if (typeof window === 'undefined') {
		console.log('[DB] Skipping init: running in SSR context');
		return;
	}

	const platform = Capacitor.getPlatform();
	if (platform === 'web') {
		console.log('[DB] Skipping init: web platform (use native build for SQLite)');
		return;
	}

	// Return early if already initialized
	if (dbConnection !== null) {
		console.log('[DB] Already initialized');
		return;
	}

	try {
		console.log(`[DB] Initializing SQLite on platform: ${platform}`);

		// Create SQLite connection
		sqliteConnection = new SQLiteConnection(CapacitorSQLite);

		// Check connection consistency
		const ret = await sqliteConnection.checkConnectionsConsistency();
		const isConn = (await sqliteConnection.isConnection(DB_NAME, false)).result;

		if (ret.result && isConn) {
			// Retrieve existing connection
			dbConnection = await sqliteConnection.retrieveConnection(DB_NAME, false);
			console.log('[DB] Retrieved existing connection');
		} else {
			// Create new connection
			dbConnection = await sqliteConnection.createConnection(
				DB_NAME,
				false, // encrypted
				'no-encryption', // mode
				1, // version
				false // readonly
			);
			console.log('[DB] Created new connection');
		}

		// Open the database
		await dbConnection.open();
		console.log(`[DB] Database "${DB_NAME}" opened successfully`);

		// Enable foreign keys
		await dbConnection.execute('PRAGMA foreign_keys = ON;');
		console.log('[DB] Foreign keys enabled');

	} catch (error) {
		console.error('[DB] Initialization failed:', error);
		throw new Error(`Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Get the current database connection.
 * Must call initDB() first.
 *
 * @returns The database connection or null if not initialized
 */
export function getDB(): SQLiteDBConnection | null {
	return dbConnection;
}

/**
 * Close the database connection.
 * Useful for cleanup or testing.
 */
export async function closeDB(): Promise<void> {
	if (dbConnection) {
		try {
			await dbConnection.close();
			dbConnection = null;
			console.log('[DB] Database closed');
		} catch (error) {
			console.error('[DB] Error closing database:', error);
			throw error;
		}
	}
}
