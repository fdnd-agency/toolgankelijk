import { getLayoutData } from '$lib/repositories/partnerRepository.js';

export async function load({ params, locals }) {
	const { websiteUID } = params;

	const { partnersData, websitesData, principlesData } = await getLayoutData(websiteUID, {
		partnerLimit: 100,
		partnerOffset: 0,
		urlLimit: 100,
		urlOffset: 0
	});
	return {
		user: locals.user,
		partnersData,
		websitesData,
		principlesData
	};
}
