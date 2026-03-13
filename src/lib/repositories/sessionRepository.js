//@ts-check

import { gql } from 'graphql-request';
import { directus } from '$lib/utils/directus.js';
import getQuerySession, {
	getQueryAddSession,
	getQueryUpdateSession,
	getQueryDeleteSession
} from '$lib/queries/session';
import { DIRECTUS_URL, VITE_DIRECTUS_KEY } from '$env/static/private';

/** @typedef {import('$lib/types').Session} Session */

/**
 * Lookup a raw session row by its token hash.
 *
 * @param {string} sessionId
 * @returns {Promise<any | null>}
 */
export async function getSessionByTokenHash(sessionId) {
	const query = getQuerySession(gql);
	const { session: sessionResult } = await directus.request(query, { sessionId });
	const row = Array.isArray(sessionResult) ? sessionResult[0] : sessionResult ?? null;
	return row ?? null;
}

/**
 * Update the expiry for a session in Directus.
 *
 * @param {{ sessionId: string; expiresAt: Date }} input
 * @returns {Promise<{ id: string } | null>}
 */
export async function updateSessionExpiry({ sessionId, expiresAt }) {
	const mutation = getQueryUpdateSession(gql);
	const variables = { sessionId, expiresAt };
	const raw = await directus.request(mutation, variables);
	return raw.updateSessie ?? null;
}

/**
 * Delete a single session in Directus.
 *
 * @param {string} sessionId
 * @returns {Promise<{ id: string } | null>}
 */
export async function deleteSessionByID(sessionId) {
	const mutation = getQueryDeleteSession(gql);
	const raw = await directus.request(mutation, { sessionId });
	return raw.deleteSessie ?? null;
}

/**
 * Low-level helper that creates a session record in Directus via REST.
 *
 * @param {{ sessionId: string; userId: string; expiresAt: Date }} input
 * @returns {Promise<Session>}
 */
export async function createSessionRecord({ sessionId, userId, expiresAt }) {
	const response = await fetch(`${DIRECTUS_URL}/items/toolgankelijk_session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${VITE_DIRECTUS_KEY}`
		},
		body: JSON.stringify({
			session_id: sessionId,
			expires_at: expiresAt.toISOString(),
			user_id: userId
		})
	});

	if (!response.ok) {
		throw new Error('Failed to create session in Directus');
	}

	return { id: sessionId, userId, expiresAt };
}

