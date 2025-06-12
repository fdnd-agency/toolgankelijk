import * as crypto from 'crypto';
import { encodeBase32UpperCaseNoPadding } from '@oslojs/encoding';

export function generateEmailVerificationCode() {
	const bytes = crypto.randomBytes(5);
	const code = encodeBase32UpperCaseNoPadding(bytes);
	return code;
}
