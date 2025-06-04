import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryPartner from '$lib/queries/partner';
import getQueryWebsite from '$lib/queries/website';
import getQueryPrincipes from '$lib/queries/principes.js';

export async function load({ params, locals }) {
	let { websiteUID } = params;
	const queryPartner = getQueryPartner(gql);
	const queryWebsite = getQueryWebsite(gql, websiteUID);
	const queryPrincipes = getQueryPrincipes(gql);

	return {
		gebruiker: locals.gebruiker,
		partnersData: await hygraph.request(queryPartner),
		websitesData: await hygraph.request(queryWebsite),
		principesData: await hygraph.request(queryPrincipes)
	};
}
