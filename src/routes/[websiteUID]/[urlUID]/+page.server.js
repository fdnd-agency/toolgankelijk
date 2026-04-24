import { redirect, error } from '@sveltejs/kit';
import { contentRepository, urlRepository } from '$lib/server/index.js';

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
		urlRepository.getUrl(urlUID),
		contentRepository.getAllPrinciples(),
		contentRepository.getLevels()
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