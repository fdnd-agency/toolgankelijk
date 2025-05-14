import { hygraph } from '$lib/utils/hygraph.js';
import { gql } from 'graphql-request';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

export function setSessionTokenCookie(event, token, houdbaarTot) {
	event.cookies.set('session', token, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: houdbaarTot
	});
}

export function generateSessionToken() {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
	return token;
}

export async function createSession(token, gebruikerId) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session = {
		id: sessionId,
		gebruikerId,
		houdbaarTot: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	const createMutation = gql`
		mutation CreateSessie($userId: ID!, $expiresAt: Date!, $sessionId: String!) {
			createSessie(
				data: {
					sessieId: $sessionId
					gebruikerId: { connect: { id: $userId } }
					houdbaarTot: $expiresAt
				}
			) {
				id
			}
		}
	`;
	await hygraph.request(createMutation, {
		userId: session.gebruikerId,
		expiresAt: session.houdbaarTot.toISOString(),
		sessionId: session.id
	});
	return session;
}
