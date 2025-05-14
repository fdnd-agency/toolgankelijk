import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import { redirect } from '@sveltejs/kit';
import getQueryAddPartner from '$lib/queries/addPartner';

export async function load({ locals }) {
	if (!locals?.sessie || !locals?.gebruiker) {
		throw redirect(302, '/login');
	}
	return {};
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const url = formData.get('url');
		const slug = name.toLowerCase();

		try {
			let query = getQueryAddPartner(gql, name, url, slug);
			let hygraphCall = await hygraph.request(query);

			return {
				hygraphCall,
				success: true,
				message: name + ' is toegevoegd.'
			};
		} catch (error) {
			return {
				message: 'Er ging wat mis, probeer het opnieuw.',
				success: false
			};
		}
	}
};
