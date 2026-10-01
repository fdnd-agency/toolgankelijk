import { redirect, error } from '@sveltejs/kit';
import { contentRepository, urlRepository } from '$lib/server/index.js';
import { createFilter } from '$lib/utils/filters.js';

// test the page without client-side JavaScript (progressive enhancement, step 2)
export const csr = false;

export const load = async ({ params, locals, url: pageUrl }) => {
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
		// filters from the url (?principe=waarneembaar&niveau=AA), shown in the subheader
		const principle = createFilter(pageUrl, {
			name: 'principe',
			label: 'Principe:',
			options: [
				{ value: 'alle', label: 'Alle principes' },
				...principlesRaw
					.filter((principle) => principle?.slug)
					.map(({ slug, title }) => ({ value: slug, label: title }))
			]
		});

		const level = createFilter(pageUrl, {
			name: 'niveau',
			label: 'Selecteer niveau:',
			options: [
				{ value: 'alle', label: 'Alle niveaus' },
				...levels
					.filter(({ level }) => level.toLowerCase() !== 'a')
					.map(({ level }) => ({ value: level, label: `Niveau ${level}` }))
			]
		});

		return {
			urlData: { url },
			principlesData: { principles: principlesRaw },
			levelData: { levels },
			filters: [principle, level]
		};
	}

	throw error(404, {
		message: 'Not found'
	});
};
