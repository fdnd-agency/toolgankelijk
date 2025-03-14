import { gql } from 'graphql-request'
import { hygraph } from '$lib/utils/hygraph.js'
import getQueryPartner from '$lib/queries/partner';
import getQueryWebsite from '$lib/queries/website';

export async function load({ params }) {
	let { websiteUID } = params
	const queryPartner = getQueryPartner(gql);
	const queryWebsite = getQueryWebsite(gql, websiteUID);

	return {
		partnersData:  await hygraph.request(queryPartner),
		websitesData: await hygraph.request(queryWebsite)
	};
}
