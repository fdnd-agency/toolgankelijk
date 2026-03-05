import { gql } from 'graphql-request';
import { directus } from '$lib/utils/directus.js';
import { redirect } from '@sveltejs/kit';
import getQueryAddPartner from '$lib/queries/addPartner';

export async function load({ locals }) {
	if (!locals?.session || !locals?.user) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailGeverifieerd) {
		throw redirect(302, '/verify-email');
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
			let directusCall = await directus.request(query);

			return {
				directusCall,
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
