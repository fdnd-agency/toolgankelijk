import { redirect } from '@sveltejs/kit';
import { partnerRepository } from '$lib/server/index.js';
import { normalizeHttpUrl } from '$lib/utils/url.js';
import { createFilter, sortByText, sortOptions } from '$lib/utils/filters.js';

// test the page without client-side JavaScript (progressive enhancement, step 2)
export const csr = false;

export async function load(event) {
	const { url, locals, cookies } = event;
	if (locals.session === null || locals.user === null) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}
	const first = 20;
	const skip = parseInt(url.searchParams.get('skip') || '0');

	const data = await partnerRepository.listPartners({
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

	return {
		...data,
		websites: sortByText(data.websites, 'title', sort.value),
		filters: [sort],
		first,
		skip,
		showRegistrationSuccess
	};
}

export const actions = {
	addPartner: async ({ request, locals }) => {
		if (!locals?.user?.isEmailVerified) {
			throw redirect(302, '/login');
		}
		try {
			const formData = await request.formData();
			const name = formData.get('name');
			const url = normalizeHttpUrl(formData.get('url'));

			if (!name || !url) {
				return {
					message: 'Naam en een geldige URL zijn verplicht.',
					success: false
				};
			}

			const slug = name.toLowerCase();
			const partner = await partnerRepository.createPartner({ name, url, slug });

			return {
				partner,
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
