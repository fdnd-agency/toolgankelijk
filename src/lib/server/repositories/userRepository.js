//@ts-check

/**
 * App users (`toolgankelijk_user`), email verification codes, and allow-list domains.
 */
import { DirectusRepositoryBase } from '$lib/server/repositories/baseRepository.js';
import {
	getQueryCheckUsernameAvailability,
	getMutationCreateUser,
	getQueryUserPasswordHash,
	getQueryUserFromEmail,
	getMutationSetUserEmailAsVerified,
	getQueryCheckEmail,
	getQueryValidEmailDomains,
	getQueryEmailVerificationById,
	getMutationCreateEmailVerification,
	getMutationDeleteEmailVerificationsForUser
} from '../queries/user.js';

/** @typedef {import('$lib/types').User} User */
/** @typedef {import('$lib/types').EmailVerificationRequest} EmailVerificationRequest */

/**
 * Account and verification persistence used by auth and email flows.
 */
export class UserRepository extends DirectusRepositoryBase {
	// Main functions

	/**
	 * `true` if no user has this username (case handled by API).
	 *
	 * @param {string} username
	 * @returns {Promise<boolean>}
	 */
	async checkUsernameAvailability(username) {
		try {
			const query = getQueryCheckUsernameAvailability();
			const data = await this.client.query(query, { username });
			return !(data.users && data.users.length);
		} catch (error) {
			console.error('userRepository.checkUsernameAvailability failed', error);
			return false;
		}
	}

	/**
	 * Insert a new user with a hashed password.
	 *
	 * @param {{ email: string; username: string; passwordHash: string; isEmailVerified?: boolean }} input
	 * @returns {Promise<User | null>}
	 */
	async createUser({ email, username, passwordHash, isEmailVerified = false }) {
		try {
			const mutation = getMutationCreateUser();
			const variables = { email, username, password: passwordHash, isEmailVerified };
			const data = await this.client.query(mutation, variables);
			const row = data.createUser ?? null;
			if (!row) return null;
			return {
				id: row.id,
				email: row.email,
				username: row.username,
				isEmailVerified: row.isEmailVerified ?? false
			};
		} catch (error) {
			console.error('userRepository.createUser failed', error);
			return null;
		}
	}

	/**
	 * Password hash for login verification (never log or return to clients).
	 *
	 * @param {string} userId
	 * @returns {Promise<string | null>}
	 */
	async getUserPasswordHash(userId) {
		try {
			const query = getQueryUserPasswordHash(userId);
			const data = await this.client.query(query);
			const row = this.firstOrNull(data.user);
			return row?.password ?? null;
		} catch (error) {
			console.error('userRepository.getUserPasswordHash failed', error);
			return null;
		}
	}

	/**
	 * Lookup user by email (for login and verification flows).
	 *
	 * @param {string} email
	 * @returns {Promise<User | null>}
	 */
	async getUserByEmail(email) {
		try {
			const query = getQueryUserFromEmail();
			const data = await this.client.query(query, { email });
			const row = this.firstOrNull(data.user);
			if (!row) return null;
			return {
				id: row.id,
				email: row.email,
				username: row.username,
				isEmailVerified: row.is_email_verified ?? false
			};
		} catch (error) {
			console.error('userRepository.getUserByEmail failed', error);
			return null;
		}
	}

	/**
	 * Set email verified flag after successful code verification.
	 *
	 * @param {string} userId
	 * @returns {Promise<User | null>}
	 */
	async markUserEmailVerified(userId) {
		try {
			const mutation = getMutationSetUserEmailAsVerified(userId);
			const data = await this.client.query(mutation);
			return data.updateUser ?? null;
		} catch (error) {
			console.error('userRepository.markUserEmailVerified failed', error);
			return null;
		}
	}

	/**
	 * `true` if no `toolgankelijk_user` row uses this email.
	 *
	 * @param {string} email
	 * @returns {Promise<boolean>}
	 */
	async checkEmailAvailability(email) {
		try {
			const query = getQueryCheckEmail();
			const data = await this.client.query(query, { email });
			const users = data.toolgankelijk_user ?? [];
			return users.length === 0;
		} catch (error) {
			console.error('userRepository.checkEmailAvailability failed', error);
			return false;
		}
	}

	/**
	 * @returns {Promise<{ domain: string }[]>}
	 */
	async getValidEmailDomains() {
		try {
			const query = getQueryValidEmailDomains();
			const data = await this.client.query(query);
			return data.toolgankelijk_email_domain ?? [];
		} catch (error) {
			console.error('userRepository.getValidEmailDomains failed', error);
			return [];
		}
	}

	/**
	 * Load a pending verification row by id (from cookie or link).
	 *
	 * @param {string} id
	 * @returns {Promise<EmailVerificationRequest | null>}
	 */
	async getEmailVerificationRequestById(id) {
		try {
			const query = getQueryEmailVerificationById(id);
			const data = await this.client.query(query);
			const row = data.emailVerificationCode ?? null;
			if (!row) return null;
			return {
				id: row.id,
				userId: row.user.id,
				email: row.user.email,
				code: row.code,
				expiresAt: new Date(row.expiresAt)
			};
		} catch (error) {
			console.error('userRepository.getEmailVerificationRequestById failed', error);
			return null;
		}
	}

	/**
	 * @param {{ code: string; expiresAt: Date; userId: string }} input
	 * @returns {Promise<EmailVerificationRequest | null>}
	 */
	async createEmailVerificationRequestRecord({ code, expiresAt, userId }) {
		try {
			const mutation = getMutationCreateEmailVerification();
			const variables = {
				code,
				expiresAt: expiresAt.toISOString(),
				userId
			};
			const data = await this.client.query(mutation, variables);
			const row = data.createEmailVerificationCode ?? null;
			if (!row) return null;
			return {
				id: row.id,
				userId: row.user.id,
				email: row.user.email,
				code: row.code,
				expiresAt: new Date(row.expiresAt)
			};
		} catch (error) {
			console.error('userRepository.createEmailVerificationRequestRecord failed', error);
			return null;
		}
	}

	/**
	 * Remove all verification codes for a user (e.g. after success or account reset).
	 *
	 * @param {string} userId
	 * @returns {Promise<{ ids: string[] } | null>}
	 */
	async deleteEmailVerificationsForUser(userId) {
		try {
			const mutation = getMutationDeleteEmailVerificationsForUser();
			const data = await this.client.query(mutation, { userId });
			return data.deleteEmailVerificationCodes ?? null;
		} catch (error) {
			console.error('userRepository.deleteEmailVerificationsForUser failed', error);
			return null;
		}
	}
}
