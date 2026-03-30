//@ts-check

/**
 * This file contains the repository for all session related data functions.
 */
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
 * @typedef {{
 *   id?: string;
 *   session_id?: string;
 *   expires_at?: string;
 *   user_id?: {
 *     id: string;
 *     email: string;
 *     username: string;
 *     is_email_verified?: boolean;
 *   };
 * }} SessionRow
 */

/**
 * Lookup a raw session row by its token hash.
 *
 * @param {string} sessionId
 * @returns {Promise<SessionRow | null>}
 */
export async function getSessionByTokenHash(sessionId) {
	try {
		const query = getQuerySession(gql);
		const { session: sessionResult } = await directus.request(query, { sessionId });
		const row = Array.isArray(sessionResult) ? sessionResult[0] : sessionResult ?? null;
		return row ?? null;
	} catch (error) {
		console.error('sessionRepository.getSessionByTokenHash failed', error);
		return null;
	}
}

/**
 * Update the expiry for a session in Directus.
 *
 * @param {{ sessionId: string; expiresAt: Date }} input
 * @returns {Promise<{ id: string } | null>}
 */
export async function updateSessionExpiry({ sessionId, expiresAt }) {
	try {
		const mutation = getQueryUpdateSession(gql);
		const variables = { sessionId, expiresAt };
		const raw = await directus.request(mutation, variables);
		return raw.updateSessie ?? null;
	} catch (error) {
		console.error('sessionRepository.updateSessionExpiry failed', error);
		return null;
	}
}

/**
 * Delete a single session in Directus.
 *
 * @param {string} sessionId
 * @returns {Promise<{ id: string } | null>}
 */
export async function deleteSessionById(sessionId) {
	try {
		const mutation = getQueryDeleteSession(gql);
		const raw = await directus.request(mutation, { sessionId });
		return raw.deleteSessie ?? null;
	} catch (error) {
		console.error('sessionRepository.deleteSessionById failed', error);
		return null;
	}
}

/**
 * Low-level helper that creates a session record in Directus via REST.
 *
 * @param {{ sessionId: string; userId: string; expiresAt: Date }} input
 * @returns {Promise<Session | null>}
 */
export async function createSessionRecord({ sessionId, userId, expiresAt }) {
	try {
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
			return null;
		}

		return { id: sessionId, userId, expiresAt };
	} catch (error) {
		console.error('sessionRepository.createSessionRecord failed', error);
		return null;
	}
}

