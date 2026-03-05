import { directus } from '$lib/utils/directus.js';
import { gql } from 'graphql-request';

export function verifyEmailInput(email) {
	return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export async function checkEmailAvailability(email) {
	const query = gql`
		query CheckEmail($email: String!) {
			gebruikers(where: { email: $email }) {
				id
			}
		}
	`;
	const data = await directus.request(query, { email });
	return data.gebruikers.length === 0;
}

export async function isValidEmailDomain(email) {
	const domain = email.split('@')[1];
	if (!domain) return false;

	const query = gql`
		query GetValidEmailDomains {
			emailDomeins {
				domein
			}
		}
	`;
	const data = await directus.request(query);
	const validDomains = new Set(data.emailDomeins.map((email) => email.domein.toLowerCase()));

	return validDomains.has(domain.toLowerCase());
}
