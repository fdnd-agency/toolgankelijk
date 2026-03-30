//@ts-check

/**
 * This file contains the repository for the content of the toolboard.
 */
import { gql } from 'graphql-request';
import { directus } from '$lib/utils/directus.js';
import getQueryPrincipes from '$lib/queries/principes.js';
import getQueryNiveaus from '$lib/queries/niveaus.js';
import getQueryToolboard from '$lib/queries/toolboard.js';

/** @typedef {import('$lib/types').Principle} Principle */
/** @typedef {import('$lib/types').Level} Level */
/** @typedef {import('$lib/types').ToolboardData} ToolboardData */
/** @typedef {import('$lib/types').ToolboardUrl} ToolboardUrl */
/** @typedef {{ id: string; successcriteria?: { id: string }[] }} RawCheck */
/** @typedef {{ successcriteria?: unknown[]; successCriteria?: unknown[] }} RawGuidelineShape */
/** @typedef {{ id: string; toolgankelijk_guideline_id?: Record<string, unknown> }} RawGuidelineNode */
/** @typedef {{ id: string; title: string; description: string; index: string; slug: string; checklist_items?: Array<Record<string, string>>; guidelines?: RawGuidelineNode[] }} RawPrincipleNode */

/**
 * Fetch all WCAG principles, mapped to the `Principle` domain type.
 *
 * @returns {Promise<Principle[]>}
 */
export async function getAllPrinciples() {
	try {
		const query = getQueryPrincipes(gql);
		const raw = await directus.request(query);

		/** @type {Array<{ id: string; description: string; index: string; slug: string; title: string; guidelines?: RawGuidelineShape[] }>} */
		const nodes = raw.toolgankelijk_principle ?? [];

		/** @type {Principle[]} */
		const principles = nodes.map((node) => ({
			id: node.id,
			description: node.description,
			index: node.index,
			slug: node.slug,
			title: node.title,
			// Keep the shape expected by progress computation (guidelines.successcriteria),
			// even when the underlying query doesn't return full guideline details.
			guidelines: (Array.isArray(node.guidelines) ? node.guidelines : []).map(
				(/** @param {RawGuidelineShape} guideline */ guideline) => ({
					...guideline,
					successcriteria: guideline?.successcriteria ?? guideline?.successCriteria ?? []
				})
			)
		}));

		return principles;
	} catch (error) {
		console.error('contentRepository.getAllPrinciples failed', error);
		return [];
	}
}

/**
 * Fetch all levels, mapped to the `Level` domain type.
 *
 * @returns {Promise<Level[]>}
 */
export async function getLevels() {
	try {
		const query = getQueryNiveaus(gql);
		const raw = await directus.request(query);

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
 * Fetch toolboard data for a given URL and principle slug.
 *
 * This returns a normalized `ToolboardData` shape instead of the raw
 * Directus response.
 *
 * @param {{ urlSlug: string; principleSlug: string }} input
 * @returns {Promise<ToolboardData>}
 */
export async function getToolboard({ urlSlug, principleSlug }) {
	try {
		const query = getQueryToolboard(gql, urlSlug, principleSlug);
		const raw = await directus.request(query);

		/** @type {{ id: string; slug: string; url: string; checks?: RawCheck[] }|null} */
		const urlNode = Array.isArray(raw?.url) ? raw.url[0] : (raw?.url?.[0] ?? null);
		/** @type {RawPrincipleNode|null} */
		const principleNode = Array.isArray(raw?.principe)
			? raw.principe[0]
			: (raw?.principe?.[0] ?? null);
		/** @type {RawPrincipleNode[]} */
		const principlesNodes = raw?.principes ?? [];

		const mappedChecks = (urlNode?.checks ?? []).map(
			/** @param {RawCheck} check */ (check) => ({
				id: check.id,
				successcriteria: (check.successcriteria ?? []).map(
					/** @param {{ id: string }} sc */ (sc) => ({
						id: sc.id
					})
				)
			})
		);

	// Ensure `url.checks[0]` always exists so the UI can render without defensive checks.
		const url =
			urlNode &&
			/** @type {ToolboardUrl} */ ({
				id: urlNode.id,
				slug: urlNode.slug,
				url: urlNode.url,
				checks:
					mappedChecks.length > 0 ? mappedChecks : [{ id: '', successcriteria: [] }]
			});

	/**
	 * @param {RawPrincipleNode} node
	 * @returns {import('$lib/types').ToolboardPrinciple}
	 */
		const mapPrinciple = (node) => ({
		id: node.id,
		title: node.title,
		description: node.description,
		index: node.index,
		slug: node.slug,
		checklistItems: (node.checklist_items ?? []).map(
			/** @param {Record<string, string>} item */ (item) => ({
				id: item.id,
				check: item.check,
				question: item.question,
				explanation: item.explanation,
				tip: item.tip
			})
		),
		guidelines: (node.guidelines ?? []).map(
			/** @param {RawGuidelineNode} guideline */ (guideline) => {
				const g = guideline.toolgankelijk_guideline_id ?? {};
				const scRelation = g?.successcriteria;
				// Directus relation shape is inconsistent: sometimes it's an array, sometimes a single object.
				// Normalize so `.map` always runs on an array.
				/** @type {Array<Record<string, unknown>>} */
				const scArray = Array.isArray(scRelation)
					? /** @type {Array<Record<string, unknown>>} */ (scRelation)
					: scRelation && typeof scRelation === 'object' && 'data' in scRelation && Array.isArray(scRelation.data)
						? /** @type {Array<Record<string, unknown>>} */ (scRelation.data)
						: scRelation && typeof scRelation === 'object' && !('data' in scRelation)
							? [/** @type {Record<string, unknown>} */ (scRelation)]
							: [];
				const successcriteria = scArray.map(
					/** @param {Record<string, unknown>} sc */ (sc) => {
						const relation =
							sc?.toolgankelijk_success_criteria_id &&
							typeof sc.toolgankelijk_success_criteria_id === 'object'
								? /** @type {Record<string, unknown>} */ (sc.toolgankelijk_success_criteria_id)
								: {};
						const easy = relation.easyCriteria ?? sc.easyCriteria;
						const criteria = relation.criteria ?? sc.criteria;
						return {
						id: /** @type {string} */ ((relation.id ?? sc.id ?? '')),
						index: /** @type {string|undefined} */ (relation.index ?? sc.index),
						niveau: /** @type {string|undefined} */ (relation.level ?? sc.level),
						title: /** @type {string|undefined} */ (relation.title ?? sc.title),
						titel: /** @type {string|undefined} */ (relation.title ?? sc.title),
						makkelijkeCriteria:
							easy
								? {
										html: /** @type {string} */ (easy)
									}
								: undefined,
						criteria:
							criteria
								? { html: /** @type {string} */ (criteria) }
								: undefined
						};
					}
				);
				return {
					id: guideline.id,
					guidelineId: /** @type {string|null} */ (g.id ?? null),
					index: /** @type {string} */ (g.index ?? ''),
					title: /** @type {string} */ (g.title ?? g.titel ?? ''),
					titel: /** @type {string} */ (g.title ?? g.titel ?? ''),
					uitleg: { html: /** @type {string} */ (g.explanation ?? '') },
					successcriteria
				};
			}
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
