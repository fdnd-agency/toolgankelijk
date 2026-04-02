//@ts-check

/**
 * WCAG principles, conformance levels, and toolboard page data (URL + principle + guidelines for checks).
 */
import { BaseRepository } from '$lib/server/repositories/baseRepository.js';
import getQueryNiveaus from '../queries/niveaus.js';
import getQueryPrincipes from '../queries/principes.js';
import getQueryToolboard from '../queries/toolboard.js';

/** @typedef {import('$lib/types').Principle} Principle */
/** @typedef {import('$lib/types').Level} Level */
/** @typedef {import('$lib/types').ToolboardData} ToolboardData */
/** @typedef {import('$lib/types').ToolboardUrl} ToolboardUrl */
/** @typedef {{ id: string; successcriteria?: Array<{ id: string; index?: string; level?: string }> }} QueryCheck */
/** @typedef {{ id: string; title?: string; description?: string; index?: string; slug?: string; guidelines?: Array<{ id?: string; toolgankelijk_guideline_id?: Record<string, unknown> }> }} QueryPrincipleNode */

/**
 * Content and checklist mapping for principles list and per-URL toolboard views.
 */
export class ContentRepository extends BaseRepository {
	// Helper functions

	/**
	 * Map a principle→guideline junction row to `Guideline` with full success-criteria fields (principles index page).
	 *
	 * @param {unknown} guideline
	 * @returns {import('$lib/types').Guideline}
	 */
	#mapListPrincipleGuidelineFromJunction(guideline) {
		const g = /** @type {Record<string, unknown>} */ (guideline);
		const guidelineNode = this.unwrapRelation(guideline, 'toolgankelijk_guideline_id') ?? {};
		const scRows = this.normalizeToArray(guidelineNode.successcriteria);
		return {
			id: /** @type {string} */ (guidelineNode.id ?? g.id ?? ''),
			successCriteria: scRows.map((row) => {
				const r = /** @type {Record<string, unknown>} */ (row);
				const scNode = this.unwrapRelation(row, 'toolgankelijk_success_criteria_id') ?? {};
				return {
					id: /** @type {string} */ (scNode.id ?? r.id ?? ''),
					index: scNode.index ?? r.index,
					level: scNode.level ?? r.level,
					title: scNode.title ?? r.title,
					easyCriteria: scNode.easyCriteria ?? scNode.easy_criteria,
					criteria: scNode.criteria
				};
			})
		};
	}

	/**
	 * Map a guideline junction row to `ToolboardGuideline` (HTML explanations, criteria for the checklist UI).
	 *
	 * @param {unknown} guideline
	 * @returns {import('$lib/types').ToolboardGuideline}
	 */
	#mapToolboardGuidelineFromJunction(guideline) {
		const junction = /** @type {Record<string, unknown>} */ (guideline);
		const g = this.unwrapRelation(guideline, 'toolgankelijk_guideline_id') ?? {};
		const scArray = this.normalizeToArray(g.successcriteria);
		const successCriteria = scArray.map((sc) => {
			const scRow = /** @type {Record<string, unknown>} */ (sc);
			const relation = this.unwrapRelation(sc, 'toolgankelijk_success_criteria_id') ?? {};
			const easy = relation.easyCriteria ?? relation.easy_criteria ?? scRow.easyCriteria;
			const criteria = relation.criteria ?? scRow.criteria;
			return {
				id: relation.id ?? scRow.id ?? '',
				index: relation.index ?? scRow.index,
				level: relation.level ?? scRow.level,
				title: relation.title ?? scRow.title,
				easyCriteria: easy ? { html: /** @type {string} */ (easy) } : undefined,
				criteria: criteria ? { html: /** @type {string} */ (criteria) } : undefined
			};
		});
		return {
			id: /** @type {string} */ (junction.id ?? ''),
			guidelineId: /** @type {string|null} */ (g.id ?? null),
			index: /** @type {string} */ (g.index ?? ''),
			title: /** @type {string} */ (g.title ?? ''),
			explanation: { html: /** @type {string} */ (g.explanation ?? '') },
			successCriteria
		};
	}

	// Main functions

	/**
	 * All principles with nested guidelines and success criteria for global navigation / listing.
	 *
	 * @returns {Promise<Principle[]>}
	 */
	async getAllPrinciples() {
		try {
			const query = getQueryPrincipes(this.gql);
			const raw = await this.client.request(query);

			/** @type {QueryPrincipleNode[]} */
			const nodes = raw.toolgankelijk_principle ?? [];

			/** @type {Principle[]} */
			const principles = nodes.map((node) => ({
				id: node.id,
				description: node.description,
				index: node.index,
				slug: node.slug,
				title: node.title,
				guidelines: this.normalizeToArray(node.guidelines, { allowSingleObject: false }).map((g) =>
					this.#mapListPrincipleGuidelineFromJunction(g)
				)
			}));

			return principles;
		} catch (error) {
			console.error('contentRepository.getAllPrinciples failed', error);
			return [];
		}
	}

	/**
	 * WCAG levels (A / AA / …) for the level selector on the toolboard.
	 *
	 * @returns {Promise<Level[]>}
	 */
	async getLevels() {
		try {
			const query = getQueryNiveaus(this.gql);
			const raw = await this.client.request(query);

			/** @type {Array<{ id: string; level: string; slug: string }>} */
			const nodes = raw.toolgankelijk_level ?? [];

			/** @type {Level[]} */
			const levels = nodes.map((node) => ({
				id: node.id,
				level: node.level,
				slug: node.slug
			}));
			return levels;
		} catch (error) {
			console.error('contentRepository.getLevels failed', error);
			return [];
		}
	}

	/**
	 * Toolboard payload for one URL and principle: checks, selected principle, and all principles for sidebar.
	 *
	 * @param {{ urlSlug: string; principleSlug: string }} input
	 * @returns {Promise<ToolboardData>}
	 */
	async getToolboard({ urlSlug, principleSlug }) {
		try {
			const query = getQueryToolboard(this.gql, urlSlug, principleSlug);
			const raw = await this.client.request(query);

			/** @type {{ id: string; slug: string; url: string; checks?: QueryCheck[] }|null} */
			const urlNode = this.firstOrNull(raw?.url);
			/** @type {QueryPrincipleNode|null} */
			const principleNode = this.firstOrNull(raw?.principe);
			/** @type {QueryPrincipleNode[]} */
			const principlesNodes = raw?.principes ?? [];

			const mappedChecks = (urlNode?.checks ?? []).map(
				/** @param {QueryCheck} check */ (check) => ({
					id: check.id,
					successCriteria: (check.successcriteria ?? []).map(
						/** @param {{ id: string }} sc */ (sc) => ({
							id: sc.id
						})
					)
				})
			);

			const url =
				urlNode &&
				/** @type {ToolboardUrl} */ ({
					id: urlNode.id,
					slug: urlNode.slug,
					url: urlNode.url,
					checks: mappedChecks.length > 0 ? mappedChecks : [{ id: '', successCriteria: [] }]
				});

			/**
			 * Map a raw principle node to the toolboard principle shape (guidelines for checklist).
			 *
			 * @param {QueryPrincipleNode} node
			 * @returns {import('$lib/types').ToolboardPrinciple}
			 */
			const mapPrinciple = (node) => ({
				id: node.id,
				title: node.title ?? '',
				description: node.description ?? '',
				index: node.index ?? '',
				slug: node.slug ?? '',
				guidelines: this.normalizeToArray(node.guidelines, { allowSingleObject: false }).map((g) =>
					this.#mapToolboardGuidelineFromJunction(g)
				)
			});

			/** @type {ToolboardData} */
			const result = {
				url: url ?? null,
				principle: principleNode ? mapPrinciple(principleNode) : null,
				principles: principlesNodes.map(mapPrinciple)
			};

			return result;
		} catch (error) {
			console.error('contentRepository.getToolboard failed', error);
			return {
				url: null,
				principle: null,
				principles: []
			};
		}
	}
}
