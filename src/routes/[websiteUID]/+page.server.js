import { gql } from 'graphql-request';
import { directus } from '$lib/utils/directus.js';
import { redirect } from '@sveltejs/kit';
import { getQueryWebsite } from '$lib/queries/partner';

// Type definitions
/**
 * @typedef {import('@sveltejs/kit').LoadEvent} LoadEvent
 */

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {LoadEvent} event
 */
export async function load(event) {
	const { params, url, locals } = event;
	const { websiteUID } = params;
	if (locals.session === null || locals.user === null) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}
	const first = 20;
	const skip = parseInt(url.searchParams.get('skip') || '0');
	const query = getQueryWebsite(gql, websiteUID, first, skip);
	const data = await directus.request(query);
	await delay(150);

	const websites = {
		website: data.toolgankelijk_website?.[0] ?? null,
		totalUrls: data.toolgankelijk_url_aggregated?.[0]?.count?.id ?? 0,
		principes: data.toolgankelijk_principle ?? []
	};

	return {
		websites,
		first,
		skip
	};
}
