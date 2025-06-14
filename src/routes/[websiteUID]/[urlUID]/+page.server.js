import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import { redirect } from '@sveltejs/kit';
import getQueryUrl from '$lib/queries/url';
import getQueryPrincipes from '$lib/queries/principes';
import getQueryNiveaus from '$lib/queries/niveaus';

export const load = async ({ params, locals }) => {
	const { websiteUID, urlUID } = params;
	if (!locals?.sessie || !locals?.gebruiker) {
		throw redirect(302, '/login');
	}
	if (!locals.gebruiker.isEmailGeverifieerd) {
		throw redirect(302, '/verify-email');
	}

	const queryUrl = getQueryUrl(gql, urlUID);
	const queryPrincipes = getQueryPrincipes(gql);
	const queryNiveaus = getQueryNiveaus(gql);
	const urlData = await hygraph.request(queryUrl);
	const principesData = await hygraph.request(queryPrincipes);
	const niveauData = await hygraph.request(queryNiveaus);

	if (urlData.url.website.slug === websiteUID)
		return {
			principesData,
			urlData,
			niveauData
		};
	throw (
		(404,
		{
			message: 'Not found'
		})
	);
};
