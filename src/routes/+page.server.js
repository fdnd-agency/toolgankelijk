import { gql } from 'graphql-request';
import { directus } from '$lib/utils/directus.js';
import { redirect } from '@sveltejs/kit';
import getQueryPartner from '$lib/queries/partner';

/**
 * @typedef {import('$lib/types.js').PartnerOverviewData} PartnerOverviewData
 * @typedef {import('@sveltejs/kit').LoadEvent} LoadEvent
 */

/**
 * @param {LoadEvent} event
 * @returns {Promise<PartnerOverviewData & { first: number; skip: number; showRegistrationSuccess: boolean }>}
 */
export async function load(event) {
	const { url, locals, cookies } = event;
	if (locals.session === null || locals.user === null) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}
	const first = 20;
	const skip = parseInt(url.searchParams.get('skip') || '0');

	const rawData = await directus.request(getQueryPartner(gql, first, skip));

	/** @type {PartnerOverviewData} */
	const data = {
		websites: rawData.toolgankelijk_website ?? [],
		totalWebsites: rawData.toolgankelijk_website_aggregated?.[0]?.count?.id ?? 0,
		principes: rawData.toolgankelijk_principle ?? []
	};

	// Check for registration success cookie
	const showRegistrationSuccess = cookies.get('show_registration_success') === '1';
	if (showRegistrationSuccess) {
		cookies.delete('show_registration_success', { path: '/' });
	}

	return {
		...data,
		first,
		skip,
		showRegistrationSuccess
	};
}
