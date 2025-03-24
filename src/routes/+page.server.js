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
		let urlArray = [];
		const sitemapArray = [
			"sitemap.xml", "sitemap_index.xml", "sitemap.php", "sitemap.txt",
			"sitemap-index.xml", "sitemap.xml.gz", "sitemap/", "sitemap/sitemap.xml",
			"sitemapindex.xml", "sitemap/index.xml", "sitemap1.xml"];

		// check if url ends with a /
		url = url.endsWith('/') ? url : url + '/';
	
		// fetch the sitemap of an url
		for (let i = 0; i < sitemapArray.length; i++) {
			try {
				console.log(`Testing the path: ${url + sitemapArray[i]}`);
				
				const siteMap = new Sitemapper({
					url: url + sitemapArray[i],
					timeout: 15000,
				});

				const { sites } = await siteMap.fetch();
				urlArray = sites || [];

				if (urlArray.length > 0) {
					console.log(`Sitemap found: ${urlArray}`);
					break;
				}
			}
			catch (error) {
				console.log(`fout: ${error}`);
			}
		}

		if (urlArray.length === 0) {
			console.log("Sitemap is not found");
		}

		// add data to hygraph
		try {
			let queryAddPartner = getQueryAddPartner(gql, name, url, slug);
			await hygraph.request(queryAddPartner);

			for (let i = 0; i < 5; i++) {
				// save each link from the sitemap array
				let link = urlArray[i];
				// create an url object for the link saved
				const urlObject = new URL(link);
				// fetch only the path name from the link
				const path = urlObject.pathname;

				let queryAddUrls = getQueryAddUrl(gql, `${path}-${slug}`, link, slug, path);
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
