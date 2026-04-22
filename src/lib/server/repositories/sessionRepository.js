//@ts-check

/**
 * Sessions: GraphQL for read/update/delete; REST POST to create rows (same collection as GraphQL).
 */
import { DirectusRepositoryBase } from '$lib/server/repositories/baseRepository.js';
import getQuerySession, {
	getQueryUpdateSession,
	getQueryDeleteSession
} from '../queries/session.js';
import { DIRECTUS_URL, VITE_DIRECTUS_KEY } from '$env/static/private';

/** @typedef {import('$lib/types').Session} Session */
/** @typedef {import('$lib/types').User} User */
/**
 */
/**
 * @typedef {{ session: Session; user: User }} SessionWithUser
 */

/**
 * Persists opaque session tokens (hashed) and ties them to users for `locals.session`.
 */
export class SessionRepository extends DirectusRepositoryBase {
	// Main functions

	/**
	 * Load session row by token hash (hex string stored from the session cookie).
	 *
	 * @param {string} sessionId Hashed session id as used in GraphQL variables (`sessionId`).
	 * @returns {Promise<SessionWithUser | null>}
	 */
	async getSessionByTokenHash(sessionId) {
		try {
			const query = getQuerySession();
			const { session: sessionResult } = await this.client.query(query, { sessionId });
			const row = this.firstOrNull(sessionResult);
			if (!row) {
				return null;
			}

			const mapped = {
				session: {
					id: row.session_id ?? row.id ?? '',
					userId: row.user_id?.id ?? '',
					expiresAt: row.expires_at ? new Date(row.expires_at) : new Date('')
				},
				user: {
					id: row.user_id?.id ?? '',
					email: row.user_id?.email ?? '',
					username: row.user_id?.username ?? '',
					isEmailVerified: row.user_id?.is_email_verified ?? false
				}
			};

			const requiredFields = [
				mapped.session.id,
				mapped.session.userId,
				mapped.user.id,
				mapped.user.email,
				mapped.user.username
			];
			if (!requiredFields.every(Boolean) || Number.isNaN(mapped.session.expiresAt.getTime())) {
				return null;
			}

			return mapped;
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
			const mutation = getQueryUpdateSession();
			const raw = await this.client.query(mutation, { sessionId, expiresAt });
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
			const mutation = getQueryDeleteSession();
			const raw = await this.client.query(mutation, { sessionId });
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
	 * @returns {Promise<Session>}
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
				throw new Error('createSessionRecord failed: response not ok');
			}

			return { id: sessionId, userId, expiresAt };
		} catch (error) {
			console.error('sessionRepository.createSessionRecord failed', error);
			throw error;
		}
	}
}
