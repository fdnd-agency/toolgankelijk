import { redirect, error } from '@sveltejs/kit';
import { getUrl } from '$lib/repositories/urlRepository.js';
import { getAllPrinciples, getLevels } from '$lib/repositories/contentRepository.js';

export const load = async ({ params, locals }) => {
	const { websiteUID, urlUID } = params;
	if (!locals?.session || !locals?.user) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}

	// Fetch URL plus principles and levels via repositories
	const [url, principlesRaw, levels] = await Promise.all([
		getUrl(urlUID),
		getAllPrinciples(),
		getLevels()
	]);

	if (url && url.website?.slug === websiteUID) {
		return {
			urlData: { url },
			principlesData: { principles: principlesRaw },
			levelData: { levels }
		};
	}

	throw error(404, {
		message: 'Not found'
	});
};
