import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import { redirect } from '@sveltejs/kit';
import getQueryUrl from '$lib/queries/url';
import getQueryPrincipes from '$lib/queries/principes';

export const load = async ({ params, locals }) => {
	const { websiteUID, urlUID } = params;
	if (!locals?.sessie || !locals?.gebruiker) {
		throw redirect(302, '/login');
	}
	const queryUrl = getQueryUrl(gql, urlUID);
	const queryPrincipes = getQueryPrincipes(gql);
	const urlData = await hygraph.request(queryUrl);
	const principesData = await hygraph.request(queryPrincipes);

	if (urlData.url.website.slug === websiteUID)
		return {
			principesData,
			urlData
		};
	throw (
		(404,
		{
			message: 'Not found'
		})
	);
};
