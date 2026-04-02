//@ts-check

/**
 * URLs under a website (`toolgankelijk_url`), checks, and success-criteria mutations for the toolboard.
 */
import { BaseRepository } from '$lib/server/repositories/baseRepository.js';
import getQueryUrl, {
	getQueryAddUrl,
	getQueryUpdateUrl,
	getQueryDeleteUrl,
	getQueryDeleteChecks,
	createEmptyCheck,
	getQueryFirstCheck,
	getMutationAddCheck,
	getMutationDeleteCheck
} from '../queries/url.js';

/** @typedef {import('$lib/types').UrlWithWebsite} UrlWithWebsite */

export class UrlRepository extends BaseRepository {
	// Main functions

	/**
	 * Load one URL by slug with nested checks and success criteria (flattened from junction rows).
	 *
	 * @param {string} slug URL slug (path segment), not the full href.
	 * @returns {Promise<UrlWithWebsite | null>}
	 */
	async getUrl(slug) {
		try {
			const query = getQueryUrl(this.gql, slug);
			const raw = await this.client.request(query);
			const node = this.firstOrNull(raw?.toolgankelijk_url);

			if (!node) return null;

			const checks = this.normalizeToArray(node.checks, { allowSingleObject: false }).map(
				(check) => ({
					id: check.id,
					successCriteria: this.normalizeToArray(check.successcriteria, {
						allowSingleObject: false
					}).map((row) => {
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
			const query = getQueryAddUrl(this.gql, urlSlug, urlLink, websiteSlug, urlName);
			const raw = await this.client.request(query);
			const row = raw.create_toolgankelijk_url_item ?? null;
			return row ? { id: row.id } : null;
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
			const query = getQueryUpdateUrl(this.gql, slug, url, id, name);
			const raw = await this.client.request(query);
			const row = raw.update_toolgankelijk_url_item ?? null;
			return row ? { id: row.id, slug, url, name } : null;
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
			const query = getQueryDeleteUrl(this.gql, id);
			const raw = await this.client.request(query);
			const row = raw.delete_toolgankelijk_url_item ?? null;
			return row ? { id: row.id } : null;
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
			const checksQuery = getQueryDeleteChecks(this.gql, id);
			await this.client.request(checksQuery);
			const deleteQuery = getQueryDeleteUrl(this.gql, id);
			const raw = await this.client.request(deleteQuery);
			const row = raw.delete_toolgankelijk_url_item ?? null;
			return row ? { id: row.id } : null;
		} catch (error) {
			console.error('urlRepository.deleteUrlWithChecks failed', error);
			return null;
		}
	}

	/**
	 * Ensure a URL has a check row (nested update on website) for new toolboard entries.
	 *
	 * @param {{ websiteSlug: string; urlSlug: string }} input
	 * @returns {Promise<{ id: string } | null>}
	 */
	async createEmptyCheckForUrl({ websiteSlug, urlSlug }) {
		try {
			const mutation = createEmptyCheck(this.gql, websiteSlug, urlSlug);
			const raw = await this.client.request(mutation);
			const row = raw.updateWebsite ?? null;
			return row ? { id: row.id } : null;
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
			const query = getQueryFirstCheck(this.gql, websiteSlug, urlSlug);
			const raw = await this.client.request(query);
			const checkId = raw.website?.urls?.[0]?.checks?.[0]?.id ?? null;
			return checkId;
		} catch (error) {
			console.error('urlRepository.getFirstCheck failed', error);
			return null;
		}
	}

	/**
	 * Link a success criterion to a check (nested website mutation).
	 *
	 * @param {{ websiteSlug: string; urlSlug: string; checkId: string; successCriterionId: string }} input
	 * @returns {Promise<{ id: string } | null>}
	 */
	async addSuccessCriterionToCheck({ websiteSlug, urlSlug, checkId, successCriterionId }) {
		try {
			const mutation = getMutationAddCheck(this.gql, websiteSlug, urlSlug, checkId, successCriterionId);
			const raw = await this.client.request(mutation);
			const row = raw.updateWebsite ?? null;
			return row ? { id: row.id } : null;
		} catch (error) {
			console.error('urlRepository.addSuccessCriterionToCheck failed', error);
			return null;
		}
	}

	/**
	 * Remove a success criterion from a check (nested website mutation).
	 *
	 * @param {{ websiteSlug: string; urlSlug: string; checkId: string; successCriterionId: string }} input
	 * @returns {Promise<{ id: string } | null>}
	 */
	async removeSuccessCriterionFromCheck({ websiteSlug, urlSlug, checkId, successCriterionId }) {
		try {
			const mutation = getMutationDeleteCheck(
				this.gql,
				websiteSlug,
				urlSlug,
				checkId,
				successCriterionId
			);
			const raw = await this.client.request(mutation);
			const row = raw.updateWebsite ?? null;
			return row ? { id: row.id } : null;
		} catch (error) {
			console.error('urlRepository.removeSuccessCriterionFromCheck failed', error);
			return null;
		}
	}
}
