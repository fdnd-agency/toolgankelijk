import { gql } from 'graphql-request';
import { directus } from '$lib/utils/directus.js';
import { redirect, error } from '@sveltejs/kit';
import getQueryUrl from '$lib/queries/url';
import getQueryPrincipes from '$lib/queries/principes';
import getQueryNiveaus from '$lib/queries/niveaus';

export const load = async ({ params, locals }) => {
	const { websiteUID, urlUID } = params;
	if (!locals?.session || !locals?.user) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}

	const queryUrl = getQueryUrl(gql, urlUID);
	const queryPrincipes = getQueryPrincipes(gql);
	const queryNiveaus = getQueryNiveaus(gql);
	const urlData = await directus.request(queryUrl);
	const principesData = await directus.request(queryPrincipes);
	const niveauData = await directus.request(queryNiveaus);

	if (urlData.url.website.slug === websiteUID)
		return {
			principesData,
			urlData,
			niveauData
		};
	throw error(404, {
		message: 'Not found'
	});
};
