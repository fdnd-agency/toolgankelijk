//@ts-check

/**
 * Partner websites (`toolgankelijk_website`): overview list, detail by slug, URL ids, and CRUD.
 */
import { BaseDirectusRepository } from '$lib/server/repositories/baseRepository';
import { error } from '@sveltejs/kit';
import getQueryPartner, {
	getQueryWebsite,
	getQueryUrlsByPartnerId,
	getQueryAddPartner,
	getQueryUpdatePartner,
	getQueryDeletePartner
} from '../queries/partner.js';

/** @typedef {import('$lib/types').PartnerWebsite} PartnerWebsite */
/** @typedef {import('$lib/types').WebsiteUrl} WebsiteUrl */
/** @typedef {import('$lib/types').PartnerOverviewData} PartnerOverviewData */
/** @typedef {import('$lib/types').WebsiteDetails} WebsiteDetails */

/**
 * Maps partner GraphQL payloads (principles, guidelines, success-criteria junctions) to normalized app types.
 *
 * @extends {BaseDirectusRepository}
 */
export class PartnerRepository extends BaseDirectusRepository {
	// Helper functions

	/**
	 * M2M junction row → `{ id }` for partner card totals.
	 *
	 * @param {unknown} row
	 * @returns {import('$lib/types').SuccessCriteriaIdRef}
	 */
	#mapM2mSuccessCriteriaRowToIdRef(row) {
		const r = /** @type {Record<string, unknown>} */ (row);
		const node = this.unwrapRelation(r, 'toolgankelijk_success_criteria_id');
		const id = node?.id ?? r.id ?? '';
		return { id };
	}

	/**
	 * Partner overview: principle→guidelines junction row with nested guideline + m2m success criteria.
	 * `successCriteria` is `null` when the relation was not loaded; otherwise id-only refs (`SuccessCriteriaIdRef`).
	 *
	 * @param {unknown} guideline
	 * @returns {import('$lib/types').Guideline}
	 */
	#mapPartnerOverviewGuideline(guideline) {
		const g = /** @type {Record<string, unknown>} */ (guideline);
		const guidelineNode = this.unwrapRelation(guideline, 'toolgankelijk_guideline_id') ?? {};
		const relation = /** @type {Record<string, unknown>} */ (guidelineNode).successcriteria;
		const scRows = this.normalizeToArray(relation);
		/** @type {import('$lib/types').SuccessCriteriaIdRef[]|null} */
		const successCriteria =
			relation == null ? null : scRows.map((r) => this.#mapM2mSuccessCriteriaRowToIdRef(r));
		return {
			id: /** @type {string} */ (guidelineNode.id ?? g.id ?? ''),
			successCriteria
		};
	}

	/**
	 * Raw `toolgankelijk_principle` nodes from partner queries → `Principle[]`.
	 *
	 * @param {unknown} principlesRaw
	 * @returns {import('$lib/types').Principle[]}
	 */
	#normalizePartnerPrinciples(principlesRaw) {
		const list = Array.isArray(principlesRaw) ? principlesRaw : [];
		return list.map((principle) => {
			const p = /** @type {Record<string, unknown>} */ (principle);
			const guidelines = this.normalizeToArray(p.guidelines, { allowSingleObject: false });
			return {
				id: /** @type {string} */ (p.id),
				slug: /** @type {string} */ (p.slug ?? ''),
				title: /** @type {string} */ (p.title ?? ''),
				guidelines: guidelines.map((row) => this.#mapPartnerOverviewGuideline(row))
			};
		});
	}

	// Main functions

	/**
	 * Paginated website list for the overview, plus principles (for filters) and total count.
	 *
	 * @param {{ limit?: number; offset?: number }} [options]
	 * @returns {Promise<PartnerOverviewData>}
	 */
	async listPartners({ limit = 20, offset = 0 } = {}) {
		try {
			const query = getQueryPartner(limit, offset);
			const raw = await this.client.query(query);
			const principles = this.#normalizePartnerPrinciples(raw.toolgankelijk_principle ?? []);

			return {
				websites: raw.toolgankelijk_website ?? [],
				totalWebsites: raw.toolgankelijk_website_aggregated?.[0]?.count?.id ?? 0,
				principles
			};
		} catch (error) {
			throw this.logAndWrapError(error, this.listPartners.name);
		}
	}

	/**
	 * One website by slug with its URLs, URL total count, and normalized principles.
	 *
	 * @param {string} slug
	 * @param {{ limit?: number; offset?: number }} [options]
	 * @returns {Promise<WebsiteDetails>}
	 */
	async getWebsiteBySlug(slug, { limit = 20, offset = 0 } = {}) {
		try {
			const query = getQueryWebsite(slug, limit, offset);
			const raw = await this.client.query(query);

			const websiteNode = raw.toolgankelijk_website?.[0] ?? null;
			const principles = this.#normalizePartnerPrinciples(raw.toolgankelijk_principle ?? []);

			return {
				website: websiteNode,
				urls: websiteNode?.urls ?? [],
				totalUrls: raw.toolgankelijk_url_aggregated?.[0]?.count?.id ?? 0,
				principles
			};
		} catch (error) {
			throw this.logAndWrapError(error, this.getWebsiteBySlug.name);
		}
	}

	/**
	 * Create a partner website row.
	 *
	 * @param {{ name: string; url: string; slug: string; totalUrls?: number }} input
	 * @returns {Promise<PartnerWebsite|null>}
	 */
	async createPartner({ name, url, slug }) {
		try {
			const query = getQueryAddPartner(name, url, slug);
			const raw = await this.client.query(query);
			const row = raw.create_toolgankelijk_website_item ?? null;
			if (!row) throw new Error(`Kon partner '${name}' niet aanmaken.`);
			return {
				id: row.id,
				title: row.title,
				homepage: row.homepage,
				slug: row.slug
			};
		} catch (error) {
			throw this.logAndWrapError(error, this.createPartner.name);
		}
	}

	/**
	 * Update title, homepage URL, and slug by id.
	 *
	 * @param {{ id: string; name: string; url: string; slug: string }} input
	 * @returns {Promise<PartnerWebsite|null>}
	 */
	async updatePartnerById({ id, name, url, slug }) {
		try {
			const query = getQueryUpdatePartner(name, slug, url, id);
			const raw = await this.client.query(query);
			const row = raw.update_toolgankelijk_website_item ?? null;
			console.log(row);
			if (!row) throw new Error(`Kon partner met ID '${id}' niet bijwerken.`);
			return {
				id: row.id,
				title: name,
				homepage: url,
				slug
			};
		} catch (error) {
			throw this.logAndWrapError(error, this.updatePartnerById.name);
		}
	}

	/**
	 * Delete a website by id; returns the deleted id on success.
	 *
	 * @param {string} partnerId
	 * @returns {Promise<{ id: string } | null>}
	 */
	async deletePartnerById(partnerId) {
		try {
			const query = getQueryDeletePartner(partnerId);
			const raw = await this.client.query(query);
			const row = raw.delete_toolgankelijk_website_item ?? null;
			return row ? { id: row.id } : null;
		} catch (error) {
			throw this.logAndWrapError(error, this.deletePartnerById.name);
		}
	}
}
