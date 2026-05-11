//@ts-check

/** @typedef {typeof import('$lib/utils/directus.js').directusClient} DirectusClient */
/** @typedef {{ client: DirectusClient }} DirectusRepositoryDependencies */

/**
 * Contains shared helpers for repositories
 */
class BaseRepository {
	// Helper functions

	/**
	 * Turn a relation field into a plain array: already an array, `{ data: [...] }`, or a single object.
	 *
	 * @template T
	 * @param {unknown} value
	 * @param {{ allowSingleObject?: boolean }} [options] When `allowSingleObject` is true (default), one object becomes a one-element array.
	 * @returns {T[]}
	 */
	normalizeToArray(value, { allowSingleObject = true } = {}) {
		if (Array.isArray(value)) return /** @type {T[]} */ (value);
		if (value && typeof value === 'object' && 'data' in value) {
			const withData = /** @type {{ data?: unknown }} */ (value);
			if (Array.isArray(withData.data)) return /** @type {T[]} */ (withData.data);
		}
		if (allowSingleObject && value && typeof value === 'object') {
			return /** @type {T[]} */ ([value]);
		}
		return [];
	}

	/**
	 * Read a nested relation object from a junction or wrapper node (e.g. `toolgankelijk_guideline_id`).
	 *
	 * @template T
	 * @param {unknown} source
	 * @param {string} relationKey
	 * @returns {T | null}
	 */
	unwrapRelation(source, relationKey) {
		if (!source || typeof source !== 'object') return null;
		const rel = /** @type {Record<string, unknown>} */ (source)[relationKey];
		if (rel && typeof rel === 'object') return /** @type {T} */ (rel);
		return null;
	}

	/**
	 * If `value` is an array, return the first element (or null if empty); if it is a non-null object, return it; otherwise null.
	 *
	 * @template T
	 * @param {unknown} value
	 * @returns {T | null}
	 */
	firstOrNull(value) {
		if (Array.isArray(value)) return /** @type {T|null} */ (value[0] ?? null);
		if (value && typeof value === 'object') return /** @type {T} */ (value);
		return null;
	}
}

/**
 * repository base for a Directus client.
 */
export class DirectusRepositoryBase extends BaseRepository {
	/**
	 * @param {DirectusRepositoryDependencies} deps
	 */
	constructor({ client }) {
		super();
		if (!client) throw new Error('DirectusRepositoryBase requires a Directus client');
		/** @type {DirectusClient} */
		this.client = client;
	}
}
