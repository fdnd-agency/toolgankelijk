import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import { redirect } from '@sveltejs/kit';
import getQueryPartner from '$lib/queries/partner';

export async function load(event) {
	const { url, locals, cookies } = event;
	if (locals.sessie === null || locals.gebruiker === null) {
		throw redirect(302, '/login');
	}
	if (!locals.gebruiker.isEmailGeverifieerd) {
		throw redirect(302, '/verify-email');
	}
	const first = 20;
	const skip = parseInt(url.searchParams.get('skip') || '0');

	let query = getQueryPartner(gql, first, skip);
	const data = await hygraph.request(query);

	// Check for registration success cookie
	const showRegistrationSuccess = cookies.get('show_registration_success') === '1';
	if (showRegistrationSuccess) {
		cookies.delete('show_registration_success', { path: '/' });
	}

	return {
		websites: data,
		first,
		skip,
		showRegistrationSuccess
	};
}
