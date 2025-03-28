import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryDeletePartner from '$lib/queries/deletePartner';
import getQueryUpdatePartner from '$lib/queries/updatePartner';
import getQueryPartner from '$lib/queries/partner';
import getQueryAddPartner from '$lib/queries/addPartner';
import getQueryAddUrl from '$lib/queries/addUrl';
import getQueryUrl from '$lib/queries/url';
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
		// for (let i = 0; i < sitemapArray.length; i++) {
		// 	try {
		// 		console.log(`Testing the path: ${url + sitemapArray[i]}`);

		// 		const siteMap = new Sitemapper({
		// 			url: url + sitemapArray[i],
		// 			timeout: 15000,
		// 		});

		// 		const { sites } = await siteMap.fetch();
		// 		urlArray = sites || [];

		// 		if (urlArray.length > 0) {
		// 			console.log("Sitemap found");
		// 			break;
		// 		}
		// 	}
		// 	catch (error) {
		// 		console.log(`fout: ${error}`);
		// 	}
		// }

		// if (urlArray.length === 0) {
		// 	console.log("Sitemap is not found");
		// }

		// Create an array of promises for the sitemap checks
		const sitemapPromises = sitemapArray.map((sitemapPath) => {
			return new Promise(async (resolve, reject) => {
				try {
					console.log(`Testing the path: ${url + sitemapPath}`);
					
					const siteMap = new Sitemapper({
						url: url + sitemapPath,
						timeout: 15000,
					});

					const { sites } = await siteMap.fetch();
					if (sites && sites.length > 0) {
						resolve(sites); // Return the found sites if the sitemap is valid
					} else {
						resolve([]); // Return an empty array if no sites found
					}
				} catch (error) {
					reject(`Error with sitemap path: ${sitemapPath}, ${error}`);
				}
			});
		});

		// Wait for all the sitemap checks to finish
		try {
			const sitemapResults = await Promise.all(sitemapPromises);

			// Loop over the results and check which sitemap returned sites
			for (let i = 0; i < sitemapResults.length; i++) {
				const result = sitemapResults[i];
				if (result.length > 0) {
					console.log("Sitemap found");
					urlArray = result; // Set the found sitemap URLs
					break; // Exit the loop as we found a valid sitemap
				}
			}

			if (urlArray.length === 0) {
				console.log("Sitemap is not found");
			}
		} catch (error) {
			console.log(`Error: ${error}`);
		}


		// add data to hygraph
		try {
			let queryAddPartner = getQueryAddPartner(gql, name, url, slug);
			await hygraph.request(queryAddPartner);

			async function delay(ms) {
				return new Promise(resolve => setTimeout(resolve, ms));
			}

			async function processUrls() {
				for (let i = 0; i < urlArray.length; i++) {
					console.log(`attempt: ${i}`);
					// save each link from the sitemap array
					let link = urlArray[i];
					// create an url object for the link saved
					const urlObject = new URL(link);
					// fetch only the path name from the link
					const path = urlObject.pathname;

					// replace all / with a - to make the slug work
					let urlSlug = path + slug;
					urlSlug = urlSlug.replace(/\//g, "-");

					let queryAddUrls = getQueryAddUrl(gql, urlSlug, link, slug, path);
					await hygraph.request(queryAddUrls);

					// wait 5 loops then apply 0.1 seconds delay
					if ((i + 1) % 5 === 0) {
						await delay(100);
					}
				}
			}

			processUrls();

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

		let queryDelete = getQueryDeletePartner(gql, id);
		const deleteResponse = await hygraph.request(queryDelete);
		console.log(deleteResponse);

		const websiteSlug = deleteResponse.deleteWebsite.slug;
		console.log(websiteSlug);

		let queryUrls = getQueryUrl(gql, websiteSlug);
		await hygraph.request(queryUrls);

		return await hygraph.request(queryDelete);
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
