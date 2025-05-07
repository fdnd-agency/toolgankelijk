import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryDeletePartner from '$lib/queries/deletePartner';
import getQueryUpdatePartner from '$lib/queries/updatePartner';
import getQueryPartner from '$lib/queries/partner';
import getQueryAddPartner from '$lib/queries/addPartner';
import getQueryAddUrl from '$lib/queries/addUrl';
import getQueryUrl from '$lib/queries/url';
import getQueryDeleteUrl from '$lib/queries/deleteUrl';
import getQueryPartnerUrls from '$lib/queries/partnerUrls';
import getQueryUpdatePartnerUrls from '$lib/queries/update';
import Sitemapper from 'sitemapper';
import axios from 'axios';
import { parseHTML } from 'linkedom';

export async function load({url}) {
	const first = 20;
	const skip = parseInt(url.searchParams.get('skip') || '0');

	let query = getQueryPartner(gql, first, skip);
	const data = await hygraph.request(query);
	
	return {
		websites: data,
		first,
		skip
	};
}

export const actions = {
	addPartner: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		let url = formData.get('url');
		let toggleSitemap = formData.get('sitemap') === "on";
		const slug = name.toLowerCase();
		let urlArray = [];
		const sitemapArray = [
			"sitemap.xml", "sitemap_index.xml", "sitemap.php", "sitemap.txt",
			"sitemap-index.xml", "sitemap.xml.gz", "sitemap/", "sitemap/sitemap.xml",
			"sitemapindex.xml", "sitemap/index.xml", "sitemap1.xml", "robots.txt"];
		
		function isValidUrl(url) {
			return !url.includes('/document') && !url.includes('/documents');
		}

		if (toggleSitemap) {
		// check if url ends with a /
		url = url.endsWith('/') ? url : url + '/';

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
						resolve(sites.filter(isValidUrl)); // Return the found sites if the sitemap is valid
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
				console.log("Sitemap is not found, trying to extract URLs from the page");
				// If no sitemap found, try to extract URLs from the page
				try {
					const visited = new Set();
					const toVisit = [url];

					async function getLinksFromPage(pageUrl) {
						const res = await axios.get(pageUrl);
						const { document } = parseHTML(res.data);

						const links = [...document.querySelectorAll('a')]
							.map(a => a.getAttribute('href'))
							.filter(href => href && !href.startsWith('#'))
							.map(href => new URL(href, pageUrl).href)
							.filter(href => href.startsWith(url))
							.filter(isValidUrl);

						return [...new Set(links)];
					}

					while (toVisit.length > 0) {
						// fetch the next URL to visit
						const currentUrl = toVisit.shift();

						// if the URL is already visited, skip it
						if (visited.has(currentUrl)) continue;
						visited.add(currentUrl);

						console.log(`Visiting: ${currentUrl}`);

						// fetch the page and extract links
						try {
							const foundLinks = await getLinksFromPage(currentUrl);
							for (const link of foundLinks) {
								// add the link to the visited set
								if (!visited.has(link) && !toVisit.includes(link)) {
									toVisit.push(link);
								}
							}
						} catch (error) {
							console.log(`Error fetching ${currentUrl}: ${error.message}`);
						}
					}

					// remove duplicates and filter out external links
					urlArray = Array.from(visited);
					console.log("All URLs collected:", urlArray.length);
				} catch (error) {
					console.log(`Something went wrong: ${error}`);
				}
			}
		} catch (error) {
			console.log(`Error: ${error}`);
		}
	}

		// add data to hygraph
		try {
			let queryAddPartner = getQueryAddPartner(gql, name, url, slug, urlArray.length);
			await hygraph.request(queryAddPartner);

			console.log('Partner added.');

			if (toggleSitemap) {
				async function delay(ms) {
					return new Promise(resolve => setTimeout(resolve, ms));
				}

				let totalUrls = urlArray.length;
				let failedUrls = {};

				async function processUrls() {
					for (let i = 1; i < urlArray.length; i++) {
						console.log(`url: ${i}`);
						// save each link from the sitemap array
						let link = urlArray[i];
						// create an url object for the link saved
						const urlObject = new URL(link);
						// fetch only the path name from the link
						const path = urlObject.pathname;

						// replace all / with a - to make the slug work
						let urlSlug = slug + path;
						urlSlug = urlSlug.replace(/\//g, "-");

						let queryAddUrls = getQueryAddUrl(gql, urlSlug, link, slug, path);
						
						try {
							await hygraph.request(queryAddUrls);
							console.log(`Added ${link}`);
						} catch (error) {
							console.error(`Error adding ${link}: ${error.message}`);
							totalUrls--;
							failedUrls[link] = error.message; // Store the failed URL and error message
						}

						// delay of 0.15 seconds
						await delay(150);
					}
				}

				await processUrls();
				// update url length again in case some urls failed to add
				try {
					let getQueryUpdatePartnerUrls = getQueryUpdatePartnerUrls(gql, slug, totalUrls);
					await hygraph.request(getQueryUpdatePartnerUrls);
				}
				catch (error) {
					console.error(`Error updating the partner: ${error.message}`);
				}

				console.log(`All urls added: ${totalUrls}`);
				if (Object.keys(failedUrls).length > 0) {
				console.log('Failed URLs:', failedUrls);
				}
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
		console.log(id);

		let allUrls = [];
		let skip = 0;
		const batchSize = 100;

		// fetch all partner urls
		while (true) {
			let queyryPartnerUrls = getQueryPartnerUrls(gql, id, skip, batchSize);
			const { urls } = await hygraph.request(queyryPartnerUrls);
		
			if (!urls || urls.length === 0) break;
		
			allUrls.push(...urls);
			skip += batchSize;
		
			// delay of 0.15 seconds
			await delay(150);
		}
		console.log(allUrls.length);

		// delete all urls
		async function delay(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		async function processUrls() {
			for (let i = 1; i < allUrls.length; i++) {
				console.log(`url: ${i}`);
				// save each link from the sitemap array
				let link = allUrls[i];

				let queryDeleteUrls = getQueryDeleteUrl(gql, link.id);
				try {
					console.log(`Deleting ${link.id}`);
					await hygraph.request(queryDeleteUrls);
				}catch (error) {
					console.error(`Error deleting ${link.id}: ${error.message}`);
				}

				await delay(150);
			}
		}

		await processUrls();
		console.log('All urls deleted.')

		// delete partner
		let queryDelete = getQueryDeletePartner(gql, id);
		const deleteResponse = await hygraph.request(queryDelete);
		console.log(deleteResponse);

		return deleteResponse;
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
