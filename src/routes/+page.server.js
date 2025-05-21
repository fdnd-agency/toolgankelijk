import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import getQueryDeletePartner from '$lib/queries/deletePartner';
import getQueryUpdatePartner from '$lib/queries/updatePartner';
import getQueryPartner from '$lib/queries/partner';
import getQueryDeleteUrl from '$lib/queries/deleteUrl';
import getQueryPartnerUrls from '$lib/queries/partnerUrls';

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
	deletePartner: async ({ request }) => {
		console.log("Partner aan het verwijderen");
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
		console.log("Partner aan het editen");
		const formData = await request.formData();
		const id = formData.get('id');
		const name = formData.get('name');
		const slug = formData.get('slug');
		const url = formData.get('url');
		let query = getQueryUpdatePartner(gql, name, slug, url, id);
		return await hygraph.request(query);
	}
};
