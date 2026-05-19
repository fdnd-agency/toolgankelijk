//@ts-check

/**
 * URLs under a website (`toolgankelijk_url`), checks, and success-criteria updates for the toolboard.
 */
import {
	createItem,
	deleteItem,
	deleteItems,
	readItem,
	readItems,
	updateItem
} from '@directus/sdk';
import { DirectusRepositoryBase } from '$lib/server/repositories/baseRepository.js';
import { normalizeHttpUrl } from '$lib/utils/url.js';

/** @typedef {import('$lib/types').UrlWithWebsite} UrlWithWebsite */
/** @typedef {import('$lib/types').WebsiteUrl} Url */

const COLLECTION_URL = 'toolgankelijk_url';
const COLLECTION_CHECK = 'toolgankelijk_check';

export class UrlRepository extends DirectusRepositoryBase {
	/**
	 * @param {unknown} check
	 */
	_successCriteriaRows(check) {
		const raw = /** @type {Record<string, unknown>} */ (check);
		return this.normalizeToArray(raw.success_criteria ?? raw.successcriteria, {
			allowSingleObject: false
		});
	}

	/**
	 * Load one URL by slug with nested checks and success criteria (flattened from junction rows).
	 *
	 * @param {string} slug URL slug (path segment), not the full href.
	 * @returns {Promise<UrlWithWebsite | null>}
	 */
	async getUrl(slug) {
		try {
			const rows = await this.client.request(
				readItems(COLLECTION_URL, {
					filter: { slug: { _eq: slug } },
					limit: 1,
					fields: [
						'id',
						'name',
						'url',
						'slug',
						'website_id.slug',
						'checks.id',
						'checks.success_criteria.id',
						'checks.success_criteria.toolgankelijk_success_criteria_id.id',
						'checks.success_criteria.toolgankelijk_success_criteria_id.index',
						'checks.success_criteria.toolgankelijk_success_criteria_id.level'
					]
				})
			);
			const node = this.firstOrNull(rows);

			if (!node) return null;

			const checks = this.normalizeToArray(node.checks, { allowSingleObject: false }).map(
				(check) => ({
					id: check.id,
					successCriteria: this._successCriteriaRows(check).map((row) => {
						const criteria = this.unwrapRelation(row, 'toolgankelijk_success_criteria_id') ?? {};
						return {
							id: criteria.id ?? row.id ?? '',
							index: criteria.index ?? row.index,
							level: criteria.level ?? row.level
						};
					})
				})
			);

			return {
				id: node.id,
				name: node.name,
				url: node.url,
				slug: node.slug,
				website: node.website_id,
				checks
			};
		} catch (error) {
			console.error('urlRepository.getUrl failed', error);
			return null;
		}
	}

	/**
	 * Create a URL under a website identified by `websiteSlug`.
	 *
	 * @param {{ urlSlug: string; urlLink: string; websiteSlug: string; urlName: string }} input
	 * @returns {Promise<{ id: string } | null>}
	 */
	async addUrl({ urlSlug, urlLink, websiteSlug, urlName }) {
		try {
			const normalizedUrlLink = normalizeHttpUrl(urlLink);
			if (!normalizedUrlLink) {
				console.error('urlRepository.addUrl invalid url', { urlLink });
				return null;
			}

			const websites = await this.client.request(
				readItems('toolgankelijk_website', {
					filter: { slug: { _eq: String(websiteSlug) } },
					limit: 1,
					fields: ['id', 'slug']
				})
			);
			const website = this.firstOrNull(websites);
			if (!website?.id) {
				return null;
			}
			const created = /** @type {{ id?: string }} */ (
				await this.client.request(
					createItem(
						COLLECTION_URL,
						{
							name: urlName,
							url: normalizedUrlLink,
							slug: urlSlug,
							website_id: website.id
						},
						{ fields: ['id'] }
					)
				)
			);
			return created?.id ? { id: created.id } : null;
		} catch (error) {
			console.error('urlRepository.addUrl failed', error);
			return null;
		}
	}

	/**
	 * Update slug, href, and display name by row id.
	 *
	 * @param {{ id: string; slug: string; url: string; name: string }} input
	 * @returns {Promise<{ id: string; slug: string; url: string; name: string } | null>}
	 */
	async updateUrl({ id, slug, url, name }) {
		try {
			const normalizedUrl = normalizeHttpUrl(url);
			if (!normalizedUrl) {
				console.error('urlRepository.updateUrl invalid url', { url });
				return null;
			}

			const row = /** @type {{ id?: string }} */ (
				await this.client.request(
					updateItem(COLLECTION_URL, id, { slug, url: normalizedUrl, name })
				)
			);
			return row?.id ? { id: row.id, slug, url: normalizedUrl, name } : null;
		} catch (error) {
			console.error('urlRepository.updateUrl failed', error);
			return null;
		}
	}

	/**
	 * Delete a URL row by id (does not remove related checks first — use {@link deleteUrlWithChecks} if needed).
	 *
	 * @param {string} id
	 * @returns {Promise<{ id: string } | null>}
	 */
	async deleteUrl(id) {
		try {
			await this.client.request(deleteItem(COLLECTION_URL, id));
			return { id };
		} catch (error) {
			console.error('urlRepository.deleteUrl failed', error);
			return null;
		}
	}

	/**
	 * Delete checks for the URL, then delete the URL row.
	 *
	 * @param {string} id
	 * @returns {Promise<{ id: string } | null>}
	 */
	async deleteUrlWithChecks(id) {
		try {
			await this.client.request(
				deleteItems(COLLECTION_CHECK, {
					filter: { url: { _eq: id } }
				})
			);
			await this.client.request(deleteItem(COLLECTION_URL, id));
			return { id };
		} catch (error) {
			console.error('urlRepository.deleteUrlWithChecks failed', error);
			return null;
		}
	}

	/**
	 * Ensure a URL has a check row for new toolboard entries.
	 *
	 * @param {{ websiteSlug: string; urlSlug: string }} input
	 * @returns {Promise<{ id: string } | null>}
	 */
	async createEmptyCheckForUrl({ websiteSlug, urlSlug }) {
		try {
			const rows = await this.client.request(
				readItems(COLLECTION_URL, {
					filter: { slug: { _eq: urlSlug } },
					fields: ['id', 'website_id.slug']
				})
			);
			const urlRow = this.normalizeToArray(rows, { allowSingleObject: false }).find(
				(row) => row?.website_id?.slug === websiteSlug
			);
			if (!urlRow?.id) return null;

			const created = /** @type {{ id?: string }} */ (
				await this.client.request(
					createItem(COLLECTION_CHECK, {
						url: urlRow.id
					})
				)
			);
			return created?.id ? { id: created.id } : null;
		} catch (error) {
			console.error('urlRepository.createEmptyCheckForUrl failed', error);
			return null;
		}
	}

	/**
	 * First check id for a URL under a website (if any).
	 *
	 * @param {{ websiteSlug: string; urlSlug: string }} input
	 * @returns {Promise<string | null>}
	 */
	async getFirstCheck({ websiteSlug, urlSlug }) {
		try {
			const rows = await this.client.request(
				readItems(COLLECTION_URL, {
					filter: { slug: { _eq: urlSlug } },
					fields: ['website_id.slug', 'checks.id']
				})
			);
			const url = this.normalizeToArray(rows, { allowSingleObject: false }).find(
				(row) => row?.website_id?.slug === websiteSlug
			);
			const checks = this.normalizeToArray(url?.checks, { allowSingleObject: false });
			return checks[0]?.id ?? null;
		} catch (error) {
			console.error('urlRepository.getFirstCheck failed', error);
			return null;
		}
	}

	/**
	 * Success-criteria ids currently linked to a check (M2M junction rows).
	 *
	 * @param {string} checkId
	 * @returns {Promise<string[]>}
	 */
	async getLinkedSuccessCriteriaIds(checkId) {
		const row = await this.client.request(
			readItem(COLLECTION_CHECK, checkId, {
				fields: ['success_criteria.toolgankelijk_success_criteria_id.id']
			})
		);
		const rows = this._successCriteriaRows(row ?? {});
		return rows
			.map((r) => this.unwrapRelation(r, 'toolgankelijk_success_criteria_id')?.id)
			.filter((id) => id != null && id !== '')
			.map((id) => String(id));
	}

	/**
	 * Gets paired succescriteria rows based on junctionid
	 *
	 * @param {string} checkId
	 * @returns {Promise<Array<{ junctionId: string; criterionId: string }>>}
	 */
	async getLinkedSuccessCriteriaRows(checkId) {
		const row = await this.client.request(
			readItem(COLLECTION_CHECK, checkId, {
				fields: ['success_criteria.id', 'success_criteria.toolgankelijk_success_criteria_id.id']
			})
		);
		const rows = this._successCriteriaRows(row ?? {});
		return rows
			.map((r) => ({
				junctionId: String(r?.id ?? ''),
				criterionId: String(this.unwrapRelation(r, 'toolgankelijk_success_criteria_id')?.id ?? '')
			}))
			.filter((r) => r.junctionId !== '' && r.criterionId !== '');
	}
	/**
	 * Fetches all URL records associated with a specific partner.
	 * Uses internal pagination to retrieve all matching items from the collection.
	 *
	 * @param {string} partnerId The unique identifier of the partner (website_id).
	 * @param {Object} [options] Optional configuration for the fetch operation.
	 * @param {number} [options.batchSize=100] Number of items to fetch per request.
	 * @param {number} [options.delayMs=0] Optional delay in milliseconds between paginated requests.
	 * @returns {Promise<Array<Pick<Url, 'id'>>>} A promise that resolves to an array of objects containing at least the URL ID.
	 */
	async getAllPartnerUrls(partnerId, { batchSize = 100, delayMs = 0 } = {}) {
		if (!partnerId) {
			throw new TypeError('getPartnerUrls: "partnerId" is required');
		}
		if (typeof batchSize !== 'number' || batchSize <= 0) {
			throw new TypeError('getPartnerUrls: "batchSize" must be a positive number');
		}
		if (typeof delayMs !== 'number' || delayMs < 0) {
			throw new TypeError('getPartnerUrls: "delayMs" must be a non-negative number');
		}

		const filter = {
			website_id: { _eq: partnerId }
		};

		const fields = ['id', 'name', 'url', 'slug', 'website_id.slug'];
		try {
			return await this._fetchAllFromCollection({
				collection: COLLECTION_URL,
				filter,
				fields,
				batchSize,
				delayMs,
				mapFn: (u) => ({
					id: u.id
				})
			});
		} catch (error) {
			console.error('urlRepository.getPartnerUrls failed', error);
			throw new Error('Failed to fetch partner URLS');
		}
	}

	/**
	 * Link a success criterion to a check.
	 *
	 * @param {{ websiteSlug?: string; urlSlug?: string; checkId: string; successCriteriaId: string }} input
	 * @returns {Promise<{ id: string } | null>}
	 */
	async addSuccessCriteriaToCheck({ checkId, successCriteriaId }) {
		try {
			const existing = await this.getLinkedSuccessCriteriaIds(checkId);
			if (existing.includes(String(successCriteriaId))) {
				return { id: checkId };
			}
			const row = /** @type {{ id?: string }} */ (
				await this.client.request(
					updateItem(COLLECTION_CHECK, checkId, {
						success_criteria: {
							create: [
								{
									toolgankelijk_success_criteria_id: String(successCriteriaId)
								}
							]
						}
					})
				)
			);
			return row?.id ? { id: row.id } : null;
		} catch (error) {
			console.error('urlRepository.addSuccessCriteriaToCheck failed', error);
			return null;
		}
	}

	/**
	 * Remove a success criterion from a check (M2M: read current links, filter id out, replace set).
	 *
	 * @param {{ websiteSlug?: string; urlSlug?: string; checkId: string; successCriteriaId: string }} input
	 * @returns {Promise<{ id: string } | null>}
	 */
	async removeSuccessCriteriaFromCheck({ checkId, successCriteriaId }) {
		try {
			const linkedRows = await this.getLinkedSuccessCriteriaRows(checkId);
			const junctionIdsToDelete = linkedRows
				.filter((row) => row.criterionId === String(successCriteriaId))
				.map((row) => row.junctionId);
			if (junctionIdsToDelete.length === 0) {
				return { id: checkId };
			}
			const relationCollection = 'toolgankelijk_check_toolgankelijk_success_criteria';
			await this.client.request(
				deleteItems(relationCollection, { filter: { id: { _in: junctionIdsToDelete } } })
			);
			return { id: String(checkId) };
		} catch (error) {
			console.error('urlRepository.removeSuccessCriteriaFromCheck failed', error);
			return null;
		}
	}
}
