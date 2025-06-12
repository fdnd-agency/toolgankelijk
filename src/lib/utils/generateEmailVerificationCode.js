import * as crypto from 'crypto';
import { encodeBase32UpperCaseNoPadding } from '@oslojs/encoding';

export function generateEmailVerificationCode() {
	const bytes = new Uint8Array(5);
	crypto.randomFillSync(bytes);
	const code = encodeBase32UpperCaseNoPadding(bytes);
	return code;
}
