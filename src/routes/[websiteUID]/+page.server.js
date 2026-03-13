import { redirect } from '@sveltejs/kit';
import { getWebsiteBySlug as getWebsiteFromRepository } from '$lib/repositories/partnerRepository.js';

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
	const data = await getWebsiteFromRepository(websiteUID, { limit: first, offset: skip });

	const websites = {
		website: data.website ?? null,
		totalUrls: data.totalUrls ?? 0,
		principes: data.principes ?? []
	};

	return {
		websites,
		first,
		skip
	};
}
