import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryWebsite from '$lib/queries/website';

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function load({ params, url }) {
	const { websiteUID } = params;
	const first = 20;
	const skip = parseInt(url.searchParams.get('skip') || '0');

	//fetch part of the urls for pages
	const query = getQueryWebsite(gql, websiteUID, first, skip);
	const data = await hygraph.request(query);
	await delay(150);

	return {
		websites: data,
		first,
		skip
	};
}
