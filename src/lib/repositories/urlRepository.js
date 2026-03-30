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
	try {
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
	} catch (error) {
		console.error('urlRepository.getUrl failed', error);
		return null;
	}
}

/**
 * Create a new URL for a partner website.
 *
 * @param {{ urlSlug: string; urlLink: string; websiteSlug: string; urlName: string }} input
 * @returns {Promise<{ id: string } | null>}
 */
export async function addUrl({ urlSlug, urlLink, websiteSlug, urlName }) {
	try {
		const query = getQueryAddUrl(gql, urlSlug, urlLink, websiteSlug, urlName);
		const raw = await directus.request(query);
		const row = raw.create_toolgankelijk_url_item ?? null;
		return row ? { id: row.id } : null;
	} catch (error) {
		console.error('urlRepository.addUrl failed', error);
		return null;
	}
}

/**
 * Update an existing URL.
 *
 * @param {{ id: string; slug: string; url: string; name: string }} input
 * @returns {Promise<{ id: string; slug: string; url: string; name: string } | null>}
 */
export async function updateUrl({ id, slug, url, name }) {
	try {
		const query = getQueryUpdateUrl(gql, slug, url, id, name);
		const raw = await directus.request(query);
		const row = raw.update_toolgankelijk_url_item ?? null;
		return row ? { id: row.id, slug, url, name } : null;
	} catch (error) {
		console.error('urlRepository.updateUrl failed', error);
		return null;
	}
}

/**
 * Delete a single URL by id.
 *
 * @param {string} id
 * @returns {Promise<{ id: string } | null>}
 */
export async function deleteUrl(id) {
	try {
		const query = getQueryDeleteUrl(gql, id);
		const raw = await directus.request(query);
		const row = raw.delete_toolgankelijk_url_item ?? null;
		return row ? { id: row.id } : null;
	} catch (error) {
		console.error('urlRepository.deleteUrl failed', error);
		return null;
	}
}

/**
 * Delete a URL and all its checks.
 *
 * @param {string} id
 * @returns {Promise<{ id: string } | null>}
 */
export async function deleteUrlWithChecks(id) {
	try {
		const checksQuery = getQueryDeleteChecks(gql, id);
		await directus.request(checksQuery);
		const deleteQuery = getQueryDeleteUrl(gql, id);
		const raw = await directus.request(deleteQuery);
		const row = raw.delete_toolgankelijk_url_item ?? null;
		return row ? { id: row.id } : null;
	} catch (error) {
		console.error('urlRepository.deleteUrlWithChecks failed', error);
		return null;
	}
}

/**
 * Create an empty check entry for a given URL under a website.
 *
 * @param {{ websiteSlug: string; urlSlug: string }} input
 * @returns {Promise<{ id: string } | null>}
 */
export async function createEmptyCheckForUrl({ websiteSlug, urlSlug }) {
	try {
		const mutation = createEmptyCheck(gql, websiteSlug, urlSlug);
		const raw = await directus.request(mutation);
		const row = raw.updateWebsite ?? null;
		return row ? { id: row.id } : null;
	} catch (error) {
		console.error('urlRepository.createEmptyCheckForUrl failed', error);
		return null;
	}
}

/**
 * Get the first check id for a website/url combination.
 *
 * @param {{ websiteSlug: string; urlSlug: string }} input
 * @returns {Promise<string | null>}
 */
export async function getFirstCheck({ websiteSlug, urlSlug }) {
	try {
		const query = getQueryFirstCheck(gql, websiteSlug, urlSlug);
		const raw = await directus.request(query);
		const checkId = raw.website?.urls?.[0]?.checks?.[0]?.id ?? null;
		return checkId;
	} catch (error) {
		console.error('urlRepository.getFirstCheck failed', error);
		return null;
	}
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
	try {
		const mutation = getMutationAddCheck(gql, websiteSlug, urlSlug, checkId, successCriterionId);
		const raw = await directus.request(mutation);
		const row = raw.updateWebsite ?? null;
		return row ? { id: row.id } : null;
	} catch (error) {
		console.error('urlRepository.addSuccessCriterionToCheck failed', error);
		return null;
	}
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
	try {
		const mutation = getMutationDeleteCheck(gql, websiteSlug, urlSlug, checkId, successCriterionId);
		const raw = await directus.request(mutation);
		const row = raw.updateWebsite ?? null;
		return row ? { id: row.id } : null;
	} catch (error) {
		console.error('urlRepository.removeSuccessCriterionFromCheck failed', error);
		return null;
	}
}

