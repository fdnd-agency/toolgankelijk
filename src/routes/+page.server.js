import { redirect } from '@sveltejs/kit';
import { listPartners } from '$lib/repositories/partnerRepository.js';

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

	const data = await listPartners({
		limit: first,
		offset: skip
	});

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
