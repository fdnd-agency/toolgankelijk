import {
	checkEmailAvailability as repoCheckEmailAvailability,
	getValidEmailDomains as repoGetValidEmailDomains
} from '$lib/repositories/userRepository.js';

export function verifyEmailInput(email) {
	return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export async function checkEmailAvailability(email) {
	return await repoCheckEmailAvailability(email);
}

export async function isValidEmailDomain(email) {
	const domain = email.split('@')[1];
	if (!domain) return false;

	const domains = await repoGetValidEmailDomains();
	const validDomains = new Set(domains.map((entry) => entry.domain.toLowerCase()));

	return validDomains.has(domain.toLowerCase());
}
