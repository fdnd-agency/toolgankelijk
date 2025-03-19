import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryDeletePartner from '$lib/queries/deletePartner';
import getQueryUpdatePartner from '$lib/queries/updatePartner';
import getQueryPartner from '$lib/queries/partner';
import getQueryAddPartner from '$lib/queries/addPartner';
import getQueryAddUrl from '$lib/queries/addUrl';

export async function load() {
	let query = getQueryPartner(gql);
	return await hygraph.request(query);
}

export const actions = {
	addPartner: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		let url = formData.get('url');
		const slug = name.toLowerCase();

		if (url.endsWith("/")) {
			url = url.slice(0, -1);
		}

		// Temporary code, need to fetch the sitemap of an url
		const urlArray = [
			"/zoeken/",
			"/zakelijk/",
			"/contact/",
			"/storingen/"
		];

		try {
			let queryAddPartner = getQueryAddPartner(gql, name, url, slug);
			await hygraph.request(queryAddPartner);

			for (let link of urlArray) {
				let fullUrl = url + link;
				let urlName = link.replace(/^\/|\/$/g, '').toLowerCase();
				let queryAddUrls = getQueryAddUrl(gql, urlName, fullUrl, slug);
				await hygraph.request(queryAddUrls);
			}

			return {
				success: true,
				message: `${name} met ${urlArray.length} bijhorende urls is toegevoegd.`

			};
		} catch (error) {
			return {
				message: `Er ging iets mis: ${error.message}`,
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
	}
};
