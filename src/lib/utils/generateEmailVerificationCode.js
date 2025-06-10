import { encodeBase32UpperCaseNoPadding } from '@oslojs/encoding';

export function generateEmailVerificationCode() {
	const bytes = new Uint8Array(5);
	crypto.getRandomValues(bytes);
	const code = encodeBase32UpperCaseNoPadding(bytes);
	return code;
}
