import { redirect } from '@sveltejs/kit';
import { partnerRepository } from '$lib/server/index.js';
export async function load(event) {
	const { url, locals, cookies, params } = event;
	if (locals.session === null || locals.user === null) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}
	const { websiteUID } = params;
	const first = 20;
	const skip = parseInt(url.searchParams.get('skip') || '0');

	const data = await partnerRepository.getWebsiteBySlug(websiteUID, {
		limit: first,
		offset: skip
	});

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
