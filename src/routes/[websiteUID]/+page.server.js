import { redirect } from '@sveltejs/kit';
import { partnerRepository, urlRepository } from '$lib/server/index.js';
import { normalizeHttpUrl } from '$lib/utils/url.js';

export async function load(event) {
	const { url, locals, cookies, params } = event;
	if (locals.session === null || locals.user === null) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}
	const { websiteUID } = params;
	const first = 20;
	const skip = parseInt(url.searchParams.get('skip') || '0');

	const data = await partnerRepository.getWebsiteBySlug(websiteUID, {
		limit: first,
		offset: skip
	});

	// Check for registration success cookie
	const showRegistrationSuccess = cookies.get('show_registration_success') === '1';
	if (showRegistrationSuccess) {
		cookies.delete('show_registration_success', { path: '/' });
	}

	return {
		websites: data,
		first,
		skip,
		showRegistrationSuccess
	};
}

export const actions = {
	addUrl: async ({ request, locals, params }) => {
		if (!locals?.user?.isEmailVerified) {
			throw redirect(302, '/login');
		}
		try {
			const formData = await request.formData();
			const name = formData.get('name')?.toLowerCase();
			const formUrl = normalizeHttpUrl(formData.get('url'));
			const websiteSlug = params.websiteUID;

			if (!name || !formUrl) {
				return {
					message: 'Naam en een geldige URL zijn verplicht.',
					success: false
				};
			}

			const directusCall = await urlRepository.addUrl({
				urlSlug: name,
				urlLink: formUrl,
				websiteSlug,
				urlName: name
			});
			if (!directusCall) {
				return {
					message: 'Url kon niet worden opgeslagen.',
					success: false
				};
			}
			await urlRepository.createEmptyCheckForUrl({ websiteSlug, urlSlug: name });

			return {
				success: true,
				message: name + ' is toegevoegd.'
			};
		} catch (error) {
			return {
				message: 'Er ging wat mis, probeer het opnieuw.',
				success: false
			};
		}
	}
};
