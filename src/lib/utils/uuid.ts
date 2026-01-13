/**
 * UUID utility for generating unique identifiers
 */

/**
 * Generate a UUID v4 string
 * Uses crypto.randomUUID() if available, otherwise falls back to a simple implementation
 */
export function randomUUID(): string {
	// Use native crypto.randomUUID if available (modern browsers and Node.js 16+)
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}

	// Fallback implementation for older environments
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
