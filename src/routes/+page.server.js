import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryPartner from '$lib/queries/partner';

export async function load({url}) {
	const first = 20;
	const skip = parseInt(url.searchParams.get('skip') || '0');

	let query = getQueryPartner(gql, first, skip);
	const data = await hygraph.request(query);
	
	return {
		websites: data,
		first,
		skip
	};
}
