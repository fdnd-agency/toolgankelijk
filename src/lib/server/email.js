import { userRepository } from '$lib/server/index.js';

export function verifyEmailInput(email) {
	return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export async function checkEmailAvailability(email) {
	return await userRepository.checkEmailAvailability(email);
}

export async function isValidEmailDomain(email) {
	const domain = email.split('@')[1];
	if (!domain) return false;

	const domains = await userRepository.getValidEmailDomains();
	const validDomains = new Set(domains.map((entry) => entry.domain.toLowerCase()));

	return validDomains.has(domain.toLowerCase());
}
