import { error, redirect } from '@sveltejs/kit';
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
	const { params, url, locals, parent } = event;
	const { websiteUID } = params;
	if (locals.session === null || locals.user === null) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}
	const first = 20;
	const skip = parseInt(url.searchParams.get('skip') || '0');
	let data;
	if (skip === 0) {
		const parentData = await parent();
		data = parentData.websitesData;
	} else {
		data = await getWebsiteFromRepository(websiteUID, { limit: first, offset: skip });
	}

	if (!data.website) {
		throw error(404, 'Website not found');
	}

	const websites = {
		website: data.website ?? null,
		totalUrls: data.totalUrls ?? 0,
		principles: data.principles ?? []
	};

	return {
		websites,
		first,
		skip
	};
}
