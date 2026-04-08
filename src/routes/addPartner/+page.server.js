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
		const formData = await request.formData();
		const name = formData.get('name');
		const url = formData.get('url');
		const slug = name.toLowerCase();

		try {
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
