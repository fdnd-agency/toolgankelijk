import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryDeletePartner from '$lib/queries/deletePartner';
import getQueryUpdatePartner from '$lib/queries/updatePartner';
import getQueryPartner from '$lib/queries/partner';
import getQueryAddPartner from '$lib/queries/addPartner';
import getQueryAddUrl from '$lib/queries/addUrl';
import Sitemapper from 'sitemapper';

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
		let sitemapArray = [];

		// check if url ends with a /
		url = url.endsWith('/') ? url : url + '/';
	
		// fetch the sitemap of an url
		const siteMap = new Sitemapper({
			url: url + 'sitemap.xml',
			timeout: 15000,
		});

		const { sites } = await siteMap.fetch();
		sitemapArray = sites;

		// add data to hygraph
		try {
			let queryAddPartner = getQueryAddPartner(gql, name, url, slug);
			await hygraph.request(queryAddPartner);

			for (let i = 0; i < 5; i++) {
				// save each link from the sitemap array
				let link = sitemapArray[i];
				// create an url object for the link saved
				const urlObject = new URL(link);
				// fetch only the path name from the link
				const path = urlObject.pathname;

				let queryAddUrls = getQueryAddUrl(gql, `${path}-${slug}`, link, slug, path);
				await hygraph.request(queryAddUrls);
			}

			return {
				success: true,
				message: `${name} met ${sitemapArray.length} bijhorende urls is toegevoegd.`

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
