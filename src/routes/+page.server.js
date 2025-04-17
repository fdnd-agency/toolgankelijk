import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryDeletePartner from '$lib/queries/deletePartner';
import getQueryUpdatePartner from '$lib/queries/updatePartner';
import getQueryPartner from '$lib/queries/partner';
import getQueryAddPartner from '$lib/queries/addPartner';

export async function load() {
	let query = getQueryPartner(gql);
	return await hygraph.request(query);
}

export const actions = {
	addPartner: async ({ request }) => {
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
	},
	deletePartner: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		let query = getQueryDeletePartner(gql, id);
		return await hygraph.request(query);
	},
	editPartner: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const name = formData.get('name');
		const slug = formData.get('slug');
		const url = formData.get('url');
		let query = getQueryUpdatePartner(gql, name, slug, url, id);
		return await hygraph.request(query);
	},
	auditPartner: async ({ request }) => {
		const formData = await request.formData();
		const urls = JSON.parse(formData.get('urls'));
		const slug = formData.get('slug');

		if (urls.length === 0) {
			return {
				success: false,
				message: 'Geen URL\'s om te auditen.'
			};
		}
	
		try {
			const response = await fetch('http://localhost:5174/api/specifiedUrls', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ urls: urls, slug })
			});
	
			if (!response.ok) {
				const errorDetails = await response.text();
				throw new Error(`Network response was not ok: ${errorDetails}`);
			}
	
			const data = await response.json();
	
			return {
				success: true,
				message: data.message
			};
		} catch (error) {
			return {
				success: false,
				message: 'Er ging wat mis bij het starten van de audit!'
			};
		}
	}
};
