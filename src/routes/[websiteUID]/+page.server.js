import { redirect } from '@sveltejs/kit';
import { partnerRepository, urlRepository } from '$lib/server/index.js';
import { normalizeHttpUrl } from '$lib/utils/url.js';
import { createFilter, sortByText, sortOptions } from '$lib/utils/filters.js';

// test the page without client-side JavaScript (progressive enhancement, step 2)
export const csr = false;

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

	// filters from the url (?sort=z-a), shown in the subheader
	const sort = createFilter(url, { name: 'sort', label: 'Sorteren op:', options: sortOptions });

	if (data?.website?.urls) {
		data.website.urls = sortByText(data.website.urls, 'name', sort.value);
	}

	return {
		websites: data,
		filters: [sort],
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
