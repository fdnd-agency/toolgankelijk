//@ts-check

/**
 * Sessions: GraphQL for read/update/delete; REST POST to create rows (same collection as GraphQL).
 */
import { BaseRepository } from '$lib/server/repositories/baseRepository.js';
import getQuerySession, {
	getQueryUpdateSession,
	getQueryDeleteSession
} from '../queries/session.js';
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
 * Persists opaque session tokens (hashed) and ties them to users for `locals.session`.
 */
export class SessionRepository extends BaseRepository {
	// Main functions

	/**
	 * Load session row by token hash (hex string stored from the session cookie).
	 *
	 * @param {string} sessionId Hashed session id as used in GraphQL variables (`sessionId`).
	 * @returns {Promise<SessionRow | null>}
	 */
	async getSessionByTokenHash(sessionId) {
		try {
			const query = getQuerySession(this.gql);
			const { session: sessionResult } = await this.client.request({
				document: query,
				variables: { sessionId }
			});
			const row = this.firstOrNull(sessionResult);
			return row ?? null;
		} catch (error) {
			console.error('sessionRepository.getSessionByTokenHash failed', error);
			return null;
		}
	}

	/**
	 * @param {{ sessionId: string; expiresAt: Date }} input
	 * @returns {Promise<{ id: string } | null>}
	 */
	async updateSessionExpiry({ sessionId, expiresAt }) {
		try {
			const mutation = getQueryUpdateSession(this.gql);
			const raw = await this.client.request({
				document: mutation,
				variables: { sessionId, expiresAt }
			});
			return raw.updateSessie ?? null;
		} catch (error) {
			console.error('sessionRepository.updateSessionExpiry failed', error);
			return null;
		}
	}

	/**
	 * Invalidate a session by token hash (logout).
	 *
	 * @param {string} sessionId
	 * @returns {Promise<{ id: string } | null>}
	 */
	async deleteSessionById(sessionId) {
		try {
			const mutation = getQueryDeleteSession(this.gql);
			const raw = await this.client.request({
				document: mutation,
				variables: { sessionId }
			});
			return raw.deleteSessie ?? null;
		} catch (error) {
			console.error('sessionRepository.deleteSessionById failed', error);
			return null;
		}
	}

	/**
	 * Insert a session via Directus REST (server-side key). Returns a minimal `Session` for cookies.
	 *
	 * @param {{ sessionId: string; userId: string; expiresAt: Date }} input `sessionId` is the opaque token string (not the hash).
	 * @returns {Promise<Session | null>}
	 */
	async createSessionRecord({ sessionId, userId, expiresAt }) {
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
}
