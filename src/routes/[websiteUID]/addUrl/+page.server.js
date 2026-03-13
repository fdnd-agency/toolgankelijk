import { directus } from '$lib/utils/directus.js';
import { redirect } from '@sveltejs/kit';
import { getWebsiteBySlug as getWebsiteFromRepository } from '$lib/repositories/partnerRepository.js';
import { addUrl, createEmptyCheckForUrl } from '$lib/repositories/urlRepository.js';

export async function load({ params, locals }) {
	const { websiteUID } = params;
	if (!locals?.session || !locals?.user) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}
	const websitesData = await getWebsiteFromRepository(websiteUID);
	return websitesData;
}

export const actions = {
	addUrl: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name').toLowerCase();
		const formUrl = formData.get('url');
		const formSlug = formData.get('slug');

		try {
			const directusCall = await addUrl({
				urlSlug: name,
				urlLink: formUrl,
				websiteSlug: formSlug,
				urlName: name
			});
			await createEmptyCheckForUrl({ websiteSlug: formSlug, urlSlug: name });

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
