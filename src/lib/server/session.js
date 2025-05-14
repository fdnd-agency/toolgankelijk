import { hygraph } from '$lib/utils/hygraph.js';
import { gql } from 'graphql-request';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

export async function validateSessionToken(token) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const sessieQuery = gql`
		query GetSessie($sessionId: String!) {
			sessie(where: { sessieId: $sessionId }) {
				id
				sessieId
				houdbaarTot
				gebruikerId {
					id
					email
					gebruikersnaam
				}
			}
		}
	`;
	const sessieData = await hygraph.request(sessieQuery, { sessionId });
	const row = sessieData.sessie;

	if (!row) {
		return { sessie: null, gebruiker: null };
	}

	const sessie = {
		id: row.sessieId,
		houdbaarTot: new Date(row.houdbaarTot)
	};

	let gebruiker = null;
	if (row.gebruikerId) {
		gebruiker = {
			id: Number(row.gebruikerId.id),
			email: row.gebruikerId.email,
			gebruikersnaam: row.gebruikerId.gebruikersnaam
		};
	}

	if (Date.now() >= sessie.houdbaarTot.getTime()) {
		// Delete session mutation
		const deleteMutation = gql`
			mutation DeleteSessie($id: ID!) {
				deleteSessie(where: { id: $id }) {
					id
				}
			}
		`;
		await hygraph.request(deleteMutation, { id: sessie.id });
		return { sessie: null, gebruiker: null };
	}
	if (Date.now() >= sessie.houdbaarTot.getTime() - 1000 * 60 * 60 * 24 * 15) {
		sessie.houdbaarTot = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		// Update session mutation
		const updateMutation = gql`
			mutation UpdateSessie($id: ID!, $expiresAt: Float!) {
				updateSessie(where: { sessieId: $id }, data: { houdbaarTot: $expiresAt }) {
					id
				}
			}
		`;
		await hygraph.request(updateMutation, {
			id: sessie.sessieId,
			expiresAt: Math.floor(sessie.houdbaarTot.getTime() / 1000)
		});
	}
	return { sessie, gebruiker };
}

export async function invalidateSession(sessionId) {
	const deleteMutation = gql`
		mutation DeleteSessie($id: String!) {
			deleteSessie(where: { sessieId: $id }) {
				id
			}
		}
	`;
	await hygraph.request(deleteMutation, { id: sessionId });
}

export function setSessionTokenCookie(event, token, houdbaarTot) {
	event.cookies.set('session', token, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: houdbaarTot
	});
}

export function deleteSessionTokenCookie(event) {
	event.cookies.set('session', '', {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0
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
