import { partnerRepository } from '$lib/server/index.js';

export async function load({ params, locals }) {
	const { websiteUID } = params;

	const partnersData = await partnerRepository.listPartners({ limit: 20, offset: 0 });

	const websitesData = websiteUID
		? await partnerRepository.getWebsiteBySlug(websiteUID, { limit: 20, offset: 0 }) //If websiteUID is present, get the specific website by slug
		: { website: null, urls: [], totalUrls: 0, principles: partnersData.principles }; //else return the partners data with all principles

	const principlesData = { principles: websitesData.principles };
	return {
		user: locals.user,
		partnersData,
		websitesData,
		principlesData
	};
}