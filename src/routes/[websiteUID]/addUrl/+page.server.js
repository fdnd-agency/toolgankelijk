import { redirect } from '@sveltejs/kit';
import { partnerRepository, urlRepository } from '$lib/server/index.js';

export async function load({ params, locals }) {
	const { websiteUID } = params;
	if (!locals?.session || !locals?.user) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}
	const websitesData = await partnerRepository.getWebsiteBySlug(websiteUID);
	return websitesData;
}

export const actions = {
	addUrl: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name').toLowerCase();
		const formUrl = formData.get('url');
		const formSlug = formData.get('slug');

		try {
			const directusCall = await urlRepository.addUrl({
				urlSlug: name,
				urlLink: formUrl,
				websiteSlug: formSlug,
				urlName: name
			});
			if (!directusCall) {
				return {
					message: 'Url kon niet worden opgeslagen.',
					success: false
				};
			}
			await urlRepository.createEmptyCheckForUrl({ websiteSlug: formSlug, urlSlug: name });

			return {
				directusCall,
				success: true,
				message: name + ' is toegevoegd.'
			};
		} catch (error) {
			return {
				message: error + 'Er ging wat mis, probeer het opnieuw.',
				success: false
			};
		}
	}
};
