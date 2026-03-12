import { directus } from '$lib/utils/directus.js';
import { gql } from 'graphql-request';
import { getQueryCheckEmail, getQueryValidEmailDomains } from '$lib/queries/user.js';

export function verifyEmailInput(email) {
	return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export async function checkEmailAvailability(email) {
	const query = getQueryCheckEmail(gql);
	const data = await directus.request(query, { email });
	const users = data.toolgankelijk_user ?? [];
	return users.length === 0;
}

export async function isValidEmailDomain(email) {
	const domain = email.split('@')[1];
	if (!domain) return false;

	const query = getQueryValidEmailDomains(gql);
	const data = await directus.request(query);
	const domains = data.toolgankelijk_email_domain ?? [];
	const validDomains = new Set(domains.map((entry) => entry.domain.toLowerCase()));

	return validDomains.has(domain.toLowerCase());
}
