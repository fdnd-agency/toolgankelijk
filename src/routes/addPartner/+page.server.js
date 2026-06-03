import { redirect } from '@sveltejs/kit';
import { partnerRepository } from '$lib/server/index.js';

export async function load({ locals }) {
	if (!locals?.session || !locals?.user) {
		throw redirect(302, '/login');
	}
	if (!locals.user.isEmailVerified) {
		throw redirect(302, '/verify-email');
	}
	return {};
}

export const actions = {
	default: async ({ request }) => {
		try {
			const formData = await request.formData();
			const name = formData.get('name');
			const url = normalizeHttpUrl(formData.get('url'));

			if (!name) {
				return {
					message: 'Naam is verplicht.',
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
