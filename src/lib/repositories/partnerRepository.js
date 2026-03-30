//@ts-check

/**
 * This file contains the repository for all partner related data functions.
 */
import { gql } from 'graphql-request';
import { directus } from '$lib/utils/directus.js';
import getQueryPartner, {
	getQueryWebsite,
	getQueryUrlsByPartnerId,
	getQueryAddPartner,
	getQueryUpdatePartner,
	getQueryUpdatePartnerUrls,
	getQueryDeletePartner
} from '$lib/queries/partner';

/** @typedef {import('$lib/types').PartnerWebsite} PartnerWebsite */
/** @typedef {import('$lib/types').WebsiteUrl} WebsiteUrl */
/** @typedef {import('$lib/types').Principle} Principle */
/** @typedef {import('$lib/types').PartnerOverviewData} PartnerOverviewData */
/** @typedef {import('$lib/types').WebsiteDetails} WebsiteDetails */

/**
 * List partners with pagination.
 *
 * @param {{ limit?: number; offset?: number }} [options]
 * @returns {Promise<PartnerOverviewData>}
 */
export async function listPartners({ limit = 20, offset = 0 } = {}) {
	try {
		const query = getQueryPartner(gql, limit, offset);
		const raw = await directus.request(query);

		return {
			websites: raw.toolgankelijk_website ?? [],
			totalWebsites: raw.toolgankelijk_website_aggregated?.[0]?.count?.id ?? 0,
			principles: raw.toolgankelijk_principle ?? []
		};
	} catch (error) {
		console.error('partnerRepository.listPartners failed', error);
		return { websites: [], totalWebsites: 0, principles: [] };
	}
}

/**
 * Get a single website with urls and principles, including totalUrls count.
 *
 * @param {string} slug
 * @param {{ limit?: number; offset?: number }} [options]
 * @returns {Promise<WebsiteDetails>}
 */
export async function getWebsiteBySlug(slug, { limit = 20, offset = 0 } = {}) {
	try {
		const query = getQueryWebsite(gql, slug, limit, offset);
		const raw = await directus.request(query);

		const websiteNode = raw.toolgankelijk_website?.[0] ?? null;

		return {
			website: websiteNode,
			urls: websiteNode?.urls ?? [],
			totalUrls: raw.toolgankelijk_url_aggregated?.[0]?.count?.id ?? 0,
			principles: raw.toolgankelijk_principle ?? []
		};
	} catch (error) {
		console.error('partnerRepository.getWebsiteBySlug failed', error);
		return { website: null, urls: [], totalUrls: 0, principles: [] };
	}
}

/**
 * Fetch URLs belonging to a partner (website) by id, with pagination.
 *
 * @param {string} partnerId
 * @param {{ skip?: number; first?: number }} [options]
 * @returns {Promise<Array<Pick<WebsiteUrl, 'id'>>>}
 */
export async function getPartnerUrls(partnerId, { skip = 0, first = 100 } = {}) {
	try {
		const query = getQueryUrlsByPartnerId(gql, partnerId, skip, first);
		const raw = await directus.request(query);
		/** @type {WebsiteUrl[]} */
		const urls = raw.toolgankelijk_url ?? [];
		return urls.map(
			/** @returns {Pick<WebsiteUrl, 'id'>} */
			(u) => ({
				id: u.id
			})
		);
	} catch (error) {
		console.error('partnerRepository.getPartnerUrls failed', error);
		return [];
	}
}

/**
 * Create a new partner website.
 *
 * @param {{ name: string; url: string; slug: string; totalUrls?: number }} input
 * @returns {Promise<PartnerWebsite|null>}
 */
export async function createPartner({ name, url, slug, totalUrls = 0 }) {
	try {
		const query = getQueryAddPartner(gql, name, url, slug, totalUrls);
		const raw = await directus.request(query);
		const row = raw.create_toolgankelijk_website_item ?? null;
		if (!row) return null;
		return {
			id: row.id,
			title: row.title,
			homepage: row.homepage,
			slug: row.slug
		};
	} catch (error) {
		console.error('partnerRepository.createPartner failed', error);
		return null;
	}
}

/**
 * Update an existing partner website's basic fields.
 *
 * @param {{ id: string; name: string; url: string; slug: string }} input
 * @returns {Promise<PartnerWebsite|null>}
 */
export async function updatePartnerById({ id, name, url, slug }) {
	try {
		const query = getQueryUpdatePartner(gql, name, slug, url, id);
		const raw = await directus.request(query);
		const row = raw.update_toolgankelijk_website_item ?? null;
		if (!row) return null;
		return {
			id: row.id,
			title: name,
			homepage: url,
			slug
		};
	} catch (error) {
		console.error('partnerRepository.updatePartnerById failed', error);
		return null;
	}
}

/**
 * Update the total number of URLs associated with a partner.
 *
 * @param {{ slug: string; totalUrls: number }} input
 * @returns {Promise<{ id: string; totalUrls: number } | null>}
 */
export async function updatePartnerTotalUrls({ slug, totalUrls }) {
	try {
		const query = getQueryUpdatePartnerUrls(gql, slug, totalUrls);
		const raw = await directus.request(query);
		const row = raw.update_toolgankelijk_website_item ?? null;
		if (!row) return null;
		return {
			id: row.id,
			totalUrls
		};
	} catch (error) {
		console.error('partnerRepository.updatePartnerTotalUrls failed', error);
		return null;
	}
}

/**
 * Delete a partner website by id.
 *
 * @param {string} partnerId
 * @returns {Promise<{ id: string } | null>}
 */
export async function deletePartnerById(partnerId) {
	try {
		const query = getQueryDeletePartner(gql, partnerId);
		const raw = await directus.request(query);
		const row = raw.delete_toolgankelijk_website_item ?? null;
		return row ? { id: row.id } : null;
	} catch (error) {
		console.error('partnerRepository.deletePartnerById failed', error);
		return null;
	}
}
