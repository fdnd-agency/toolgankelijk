//@ts-check

import { delay } from '$lib/utils/delay';
import { readItems } from '@directus/sdk';

/** @typedef {typeof import('$lib/utils/directus').directusClient} DirectusClient */
/** @typedef {{ client: DirectusClient }} DirectusRepositoryDependencies */

export class RepositoryError extends Error {
	/**
	 * Custom error standard
	 *
	 * @param {object} params
	 * @param {string} params.repoName
	 * @param {string} params.functionName
	 * @param {number | string | null} [params.statusCode]
	 * @param {string} params.message
	 * @param {any} [params.originalError]
	 */
	constructor({ repoName: repositoryName, functionName, statusCode, message, originalError }) {
		const statusPrefix = statusCode ? ` ${statusCode}` : '';
		super(`[${repositoryName}]${statusPrefix} ${functionName}: ${message}`);

		this.name = 'RepositoryError';
		this.repoName = repositoryName;
		this.functionName = functionName;
		this.statusCode = statusCode ?? null;
		this.originalError = originalError;
	}
}

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

	/**
	 * Log an error and normalize it into a RepositoryError.
	 *
	 * @param {any} error          The original error object.
	 * @param {string} functionName Name of the repository method where it occurred.
	 * @returns {RepositoryError}   A normalized error to throw.
	 */
	logAndWrapError(error, functionName) {
		const repoName = this.constructor.name;

		const statusCode = error?.status ?? error?.response?.status ?? null;

		const statusPrefix = statusCode ? ` ${statusCode}` : '';

		const baseMessage =
			error?.message ?? (typeof error === 'string' ? error : 'An unexpected error occurred');

		const logMessage = `[${repoName}]${statusPrefix} Error in ${functionName}: ${baseMessage}`;

		console.error(logMessage);

		return new RepositoryError({
			repoName,
			functionName,
			statusCode,
			message: baseMessage,
			originalError: error
		});
	}
}

/**
 * repository base for a Directus client.
 */
export class BaseDirectusRepository extends BaseRepository {
	/**
	 * @param {DirectusRepositoryDependencies} deps
	 */
	constructor({ client }) {
		super();
		if (!client) throw new Error('DirectusRepositoryBase requires a Directus client');
		/** @type {DirectusClient} */
		this.client = client;
	}
	/**
	 * Generic helper to fetch all items from a collection with pagination.
	 *
	 * @param {Object} params
	 * @param {string} params.collection      - Directus collection name
	 * @param {Object} [params.filter]        - Directus filter object
	 * @param {string[]} [params.fields]      - Fields to select
	 * @param {string|string[]} [params.sort] - Sort order
	 * @param {number} [params.batchSize=100] - Page size
	 * @param {number} [params.delayMs=0]     - Optional delay between requests
	 * @param {(item: any) => any} [params.mapFn] - Optional mapper per item
	 */
	async _fetchAllFromCollection({
		collection,
		filter = {},
		fields,
		sort,
		batchSize = 100,
		delayMs = 0,
		mapFn
	}) {
		const allItems = [];
		let offset = 0;

		while (true) {
			const response = await this.client.request(
				readItems(collection, {
					filter,
					fields,
					sort,
					offset,
					limit: batchSize
				})
			);

			if (!response || response.length === 0) {
				break;
			}

			const items = mapFn ? response.map(mapFn) : response;
			allItems.push(...items);

			if (response.length < batchSize) {
				break;
			}

			offset += response.length;

			if (delayMs > 0) {
				await delay(delayMs);
			}
		}

		return allItems;
	}

	/**
	 * Read a nested relation object from a junction or wrapper node
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
}
