import { gql } from 'graphql-request';
import { directus } from '$lib/utils/directus.js';
import { redirect } from '@sveltejs/kit';
import getQueryAddUrl from '$lib/queries/addUrl';
import getQueryWebsite from '$lib/queries/website';
import createEmptyCheck from '$lib/queries/addEmptyCheck';

export async function load({ params, locals }) {
	const { websiteUID } = params;
	if (!locals?.session || !locals?.user) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}
	let query = getQueryWebsite(gql, websiteUID);
	return await directus.request(query).websitesData;
}

export const actions = {
	addUrl: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name').toLowerCase();
		const formUrl = formData.get('url');
		const formSlug = formData.get('slug');

		try {
			let query = getQueryAddUrl(gql, name, formUrl, formSlug);
			let directusCall = await directus.request(query);
			let createEmptyCheckEntry = createEmptyCheck(gql, formSlug, name);
			await directus.request(createEmptyCheckEntry);

			return {
				directusCall,
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
