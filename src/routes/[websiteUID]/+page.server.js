import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import { redirect } from '@sveltejs/kit';
import getQueryAddUrl from '$lib/queries/addUrl';
import getQueryWebsite from '$lib/queries/website';
import getQueryDeleteUrl from '$lib/queries/deleteUrl';
import getQueryUpdateUrl from '$lib/queries/updateUrl';
import createEmptyCheck from '$lib/queries/addEmptyCheck';
import getQueryDeleteChecks from '$lib/queries/deleteChecks';

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function load(event) {
	const { params, url, locals } = event;
	const { websiteUID } = params;
	if (locals.sessie === null || locals.gebruiker === null) {
		throw redirect(302, '/login');
	}
	const first = 20;
	const skip = parseInt(url.searchParams.get('skip') || '0');
	const query = getQueryWebsite(gql, websiteUID, first, skip);
	const data = await hygraph.request(query);
	await delay(150);

	return {
		websites: data,
		first,
		skip
	};
}
