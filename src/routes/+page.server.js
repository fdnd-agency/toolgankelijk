import { gql } from 'graphql-request';
import { hygraph } from '$lib/utils/hygraph.js';
import { redirect } from '@sveltejs/kit';
import getQueryPartner from '$lib/queries/partner';

export async function load(event) {
	const { url, locals } = event;
	if (locals.sessie === null || locals.gebruiker === null) {
		throw redirect(302, '/login');
	}
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
	auditPartner: async ({ request }) => {
		const formData = await request.formData();
		const urls = JSON.parse(formData.get('urls'));
		const slug = formData.get('slug');

		if (urls.length === 0) {
			return {
				success: false,
				message: "Geen URL's om te auditen."
			};
		}

		try {
			const response = await fetch('http://localhost:5174/api/specifiedUrls', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ urls: urls, slug })
			});

			if (!response.ok) {
				const errorDetails = await response.text();
				throw new Error(`Network response was not ok: ${errorDetails}`);
			}

			const data = await response.json();

			return {
				success: true,
				message: data.message
			};
		} catch (error) {
			return {
				success: false,
				message: 'Er ging wat mis bij het starten van de audit!'
			};
		}
	}
};
