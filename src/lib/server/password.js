import { hash, verify } from '@node-rs/argon2';
import { sha1 } from '@oslojs/crypto/sha1';
import { encodeHexLowerCase } from '@oslojs/encoding';

export async function hashPassword(password) {
	return await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
}

export async function verifyPasswordHash(hash, password) {
	return await verify(hash, password);
}

export async function verifyPasswordStrength(password) {
	if (password.length < 8) {
		return { valid: false, message: 'Password must be at least 8 characters long.' };
	}
	if (password.length > 255) {
		return { valid: false, message: 'Password must be no more than 255 characters long.' };
	}
	if (!/[A-Z]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one uppercase letter.' };
	}
	if (!/[a-z]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one lowercase letter.' };
	}
	if (!/\d/.test(password)) {
		return { valid: false, message: 'Password must contain at least one digit.' };
	}
	if (!/[^A-Za-z0-9]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one special character.' };
	}

	const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
	const hashPrefix = hash.slice(0, 5);
	const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
	const data = await response.text();
	const items = data.split('\n');
	for (const item of items) {
		const hashSuffix = item.slice(0, 35).toLowerCase();
		if (hash === hashPrefix + hashSuffix) {
			return {
				valid: false,
				message: 'This password has been leaked before. Please choose another password.'
			};
		}
	}
	return { valid: true, message: 'Password is strong enough.' };
}
