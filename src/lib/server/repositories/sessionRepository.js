//@ts-check

/**
 * Sessions: REST SDK for CRUD operations.
 */
import { createItem, readItems, updateItem, deleteItem } from '@directus/sdk';
import { BaseDirectusRepository } from '$lib/server/repositories/baseRepository';

/** @typedef {import('$lib/types').Session} Session */
/** @typedef {import('$lib/types').User} User */
/**
 * @typedef {{ session: Session; user: User }} SessionWithUser
 */

const COLLECTION_SESSION = 'toolgankelijk_session';

/**
 * Persists opaque session tokens (hashed) and ties them to users for `locals.session`.
 */
export class SessionRepository extends BaseDirectusRepository {
	// Main functions

	/**
	 * Load session row by token hash (hex string stored from the session cookie).
	 *
	 * @param {string} sessionId Hashed session id as used in GraphQL variables (`sessionId`).
	 * @returns {Promise<SessionWithUser | null>}
	 */
	async getSessionByTokenHash(sessionId) {
		try {
			const response = await this.client.request(
				readItems(COLLECTION_SESSION, {
					filter: { session_id: { _eq: sessionId } },
					limit: 1,
					fields: [
						'id',
						'session_id',
						'expires_at',
						'user_id.id',
						'user_id.email',
						'user_id.username',
						'user_id.is_email_verified'
					]
				})
			);
			const row = this.firstOrNull(response);
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
			throw this.logAndWrapError(error, this.getSessionByTokenHash.name);
		}
	}

	/**
	 * @param {{ sessionId: string; expiresAt: Date }} input
	 * @returns {Promise<{ id: string } | null>}
	 */
	async updateSessionExpiry({ sessionId, expiresAt }) {
		try {
			const response = await this.client.request(
				updateItem(COLLECTION_SESSION, sessionId, {
					expires_at: expiresAt.toISOString()
				})
			);
			if (!response) {
				throw new Error('Failed to update session expiry');
			}
			return { id: response.id };
		} catch (error) {
			throw this.logAndWrapError(error, this.updateSessionExpiry.name);
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
			await this.client.request(deleteItem(COLLECTION_SESSION, sessionId));
			return { id: sessionId };
		} catch (error) {
			throw this.logAndWrapError(error, this.deleteSessionById.name);
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
			const response = await this.client.request(
				createItem(COLLECTION_SESSION, {
					session_id: sessionId,
					expires_at: expiresAt.toISOString(),
					user_id: userId
				})
			);
			if (!response?.id) {
				throw new Error('Failed to create a new session!');
			}

			return { id: sessionId, userId, expiresAt };
		} catch (error) {
			throw this.logAndWrapError(error, this.createSessionRecord.name);
		}
	}
}
