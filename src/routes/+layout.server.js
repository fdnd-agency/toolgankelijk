import { gql } from 'graphql-request';
import { directus } from '$lib/utils/directus.js';
import getQueryPartner from '$lib/queries/partner';
import getQueryWebsite from '$lib/queries/website';
import getQueryPrincipes from '$lib/queries/principes.js';

export async function load({ params, locals }) {
	let { websiteUID } = params;
	const queryPartner = getQueryPartner(gql);
	const queryWebsite = getQueryWebsite(gql, websiteUID);
	const queryPrincipes = getQueryPrincipes(gql);

	return {
		gebruiker: locals.user,
		partnersData: await directus.request(queryPartner),
		websitesData: await directus.request(queryWebsite),
		principesData: await directus.request(queryPrincipes)
	};
}
