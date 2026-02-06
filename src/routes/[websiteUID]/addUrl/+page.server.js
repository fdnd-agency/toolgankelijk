import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import { redirect } from '@sveltejs/kit';
import getQueryAddUrl from '$lib/queries/addUrl';
import getQueryWebsite from '$lib/queries/website';
import createEmptyCheck from '$lib/queries/addEmptyCheck';

export async function load({ params, locals }) {
	const { websiteUID } = params;
	if (!locals?.sessie || !locals?.gebruiker) {
		throw redirect(302, '/login');
	}
	if (!locals.gebruiker.isEmailGeverifieerd) {
		throw redirect(302, '/verify-email');
	}
	let query = getQueryWebsite(gql, websiteUID);
	return await hygraph.request(query).websitesData;
}

export const actions = {
	addUrl: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name').toLowerCase();
		const formUrl = formData.get('url');
		const formSlug = formData.get('slug');

		try {
			let query = getQueryAddUrl(gql, name, formUrl, formSlug);
			let hygraphCall = await hygraph.request(query);
			let createEmptyCheckEntry = createEmptyCheck(gql, formSlug, name);
			await hygraph.request(createEmptyCheckEntry);

			return {
				hygraphCall,
				success: true,
				message: name + ' is toegevoegd.'
			};
		} catch (error) {
			return {
				message: error + 'Er ging wat mis, probeer het opnieuw.',
				success: false
			};
		}
	}
};
