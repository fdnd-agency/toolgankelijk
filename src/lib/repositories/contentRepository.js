//@ts-check

import { gql } from 'graphql-request';
import { directus } from '$lib/utils/directus.js';
import getQueryPrincipes from '$lib/queries/principes.js';
import getQueryNiveaus from '$lib/queries/niveaus.js';
import getQueryToolboard from '$lib/queries/toolboard.js';

/** @typedef {import('$lib/types').Principle} Principle */
/** @typedef {import('$lib/types').Level} Level */

/**
 * Fetch all WCAG principles.
 *
 * Note: This currently returns the raw `toolgankelijk_principle` records
 * as provided by Directus. The structure is richer than the minimal
 * `Principle` type and is used directly by various components.
 *
 * @returns {Promise<any>}
 */
export async function getPrincipes() {
	const query = getQueryPrincipes(gql);
	const raw = await directus.request(query);
	return raw.toolgankelijk_principle ?? [];
}

/**
 * Fetch all levels, mapped to the `Level` domain type.
 *
 * @returns {Promise<Level[]>}
 */
export async function getLevels() {
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
}

/**
 * Fetch toolboard data for a given URL and principle slug.
 *
 * Note: This currently returns the raw toolboard query result from Directus.
 *
 * @param {{ urlSlug: string; principeSlug: string }} input
 * @returns {Promise<any>}
 */
export async function getToolboard({ urlSlug, principeSlug }) {
	const query = getQueryToolboard(gql, urlSlug, principeSlug);
	const raw = await directus.request(query);
	return raw;
}

