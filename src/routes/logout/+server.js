import { deleteSessionTokenCookie } from '$lib/server/session.js';
import { deleteSessionById } from '$lib/repositories/sessionRepository.js';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

export async function POST({ cookies }) {
	const sessionToken = cookies.get('session');
	if (sessionToken) {
		const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
		await deleteSessionById(sessionId);
		deleteSessionTokenCookie({ cookies });
	}
	return new Response(null, { status: 204 });
}
