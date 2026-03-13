//@ts-check

import { gql } from 'graphql-request';
import { directus } from '$lib/utils/directus.js';
import getQueryUrl, {
	getQueryAddUrl,
	getQueryUpdateUrl,
	getQueryDeleteUrl,
	getQueryDeleteChecks,
	createEmptyCheck,
	getQueryFirstCheck,
	getMutationAddCheck,
	getMutationDeleteCheck
} from '$lib/queries/url';

/** @typedef {import('$lib/types').UrlWithWebsite} UrlWithWebsite */

/**
 * Get a single URL (page) by slug with its website and checks.
 *
 * @param {string} slug
 * @returns {Promise<UrlWithWebsite | null>}
 */
export async function getUrl(slug) {
	const query = getQueryUrl(gql, slug);
	const raw = await directus.request(query);
	const node = Array.isArray(raw?.toolgankelijk_url)
		? raw.toolgankelijk_url[0]
		: raw?.toolgankelijk_url ?? null;

	if (!node) return null;

	return {
		id: node.id,
		name: node.name,
		url: node.url,
		slug: node.slug,
		website: node.website_id,
		checks: node.checks ?? []
	};
}

/**
 * Create a new URL for a partner website.
 *
 * @param {{ urlSlug: string; urlLink: string; websiteSlug: string; urlName: string }} input
 * @returns {Promise<{ id: string } | null>}
 */
export async function addUrl({ urlSlug, urlLink, websiteSlug, urlName }) {
	const query = getQueryAddUrl(gql, urlSlug, urlLink, websiteSlug, urlName);
	const raw = await directus.request(query);
	const row = raw.create_toolgankelijk_url_item ?? null;
	return row ? { id: row.id } : null;
}

/**
 * Update an existing URL.
 *
 * @param {{ id: string; slug: string; url: string; name: string }} input
 * @returns {Promise<{ id: string; slug: string; url: string; name: string } | null>}
 */
export async function updateUrl({ id, slug, url, name }) {
	const query = getQueryUpdateUrl(gql, slug, url, id, name);
	const raw = await directus.request(query);
	const row = raw.update_toolgankelijk_url_item ?? null;
	return row ? { id: row.id, slug, url, name } : null;
}

/**
 * Delete a single URL by id.
 *
 * @param {string} id
 * @returns {Promise<{ id: string } | null>}
 */
export async function deleteUrl(id) {
	const query = getQueryDeleteUrl(gql, id);
	const raw = await directus.request(query);
	const row = raw.delete_toolgankelijk_url_item ?? null;
	return row ? { id: row.id } : null;
}

/**
 * Delete a URL and all its checks.
 *
 * @param {string} id
 * @returns {Promise<{ id: string } | null>}
 */
export async function deleteUrlWithChecks(id) {
	const checksQuery = getQueryDeleteChecks(gql, id);
	await directus.request(checksQuery);
	const deleteQuery = getQueryDeleteUrl(gql, id);
	const raw = await directus.request(deleteQuery);
	const row = raw.delete_toolgankelijk_url_item ?? null;
	return row ? { id: row.id } : null;
}

/**
 * Create an empty check entry for a given URL under a website.
 *
 * @param {{ websiteSlug: string; urlSlug: string }} input
 * @returns {Promise<{ id: string } | null>}
 */
export async function createEmptyCheckForUrl({ websiteSlug, urlSlug }) {
	const mutation = createEmptyCheck(gql, websiteSlug, urlSlug);
	const raw = await directus.request(mutation);
	const row = raw.updateWebsite ?? null;
	return row ? { id: row.id } : null;
}

/**
 * Get the first check id for a website/url combination.
 *
 * @param {{ websiteSlug: string; urlSlug: string }} input
 * @returns {Promise<string | null>}
 */
export async function getFirstCheck({ websiteSlug, urlSlug }) {
	const query = getQueryFirstCheck(gql, websiteSlug, urlSlug);
	const raw = await directus.request(query);
	const checkId = raw.website?.urls?.[0]?.checks?.[0]?.id ?? null;
	return checkId;
}

/**
 * Add a success criterion to an existing check.
 *
 * @param {{ websiteSlug: string; urlSlug: string; checkId: string; successCriterionId: string }} input
 * @returns {Promise<{ id: string } | null>}
 */
export async function addSuccessCriterionToCheck({
	websiteSlug,
	urlSlug,
	checkId,
	successCriterionId
}) {
	const mutation = getMutationAddCheck(gql, websiteSlug, urlSlug, checkId, successCriterionId);
	const raw = await directus.request(mutation);
	const row = raw.updateWebsite ?? null;
	return row ? { id: row.id } : null;
}

/**
 * Remove a success criterion from an existing check.
 *
 * @param {{ websiteSlug: string; urlSlug: string; checkId: string; successCriterionId: string }} input
 * @returns {Promise<{ id: string } | null>}
 */
export async function removeSuccessCriterionFromCheck({
	websiteSlug,
	urlSlug,
	checkId,
	successCriterionId
}) {
	const mutation = getMutationDeleteCheck(gql, websiteSlug, urlSlug, checkId, successCriterionId);
	const raw = await directus.request(mutation);
	const row = raw.updateWebsite ?? null;
	return row ? { id: row.id } : null;
}

