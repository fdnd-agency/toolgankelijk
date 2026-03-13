//@ts-check

import { directus } from '$lib/utils/directus.js';
import { gql } from 'graphql-request';
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
} from '$lib/queries/user.js';

/** @typedef {import('$lib/types').User} User */
/** @typedef {import('$lib/types').EmailVerificationRequest} EmailVerificationRequest */

/**
 * Check if a username is still available.
 *
 * @param {string} username
 * @returns {Promise<boolean>}
 */
export async function checkUsernameAvailability(username) {
	const query = getQueryCheckUsernameAvailability(gql);
	const data = await directus.request(query, { username });
	return !(data.users && data.users.length);
}

/**
 * Create a new user.
 *
 * @param {{ email: string; username: string; passwordHash: string; isEmailVerified?: boolean }} input
 * @returns {Promise<User | null>}
 */
export async function createUser({ email, username, passwordHash, isEmailVerified = false }) {
	const mutation = getMutationCreateUser(gql);
	const variables = { email, username, password: passwordHash, isEmailVerified };
	const data = await directus.request(mutation, variables);
	const row = data.createUser ?? null;
	if (!row) return null;
	return {
		id: row.id,
		email: row.email,
		username: row.username,
		isEmailVerified: row.isEmailVerified ?? false
	};
}

/**
 * Get the stored password hash for a given user id.
 *
 * @param {string} userId
 * @returns {Promise<string | null>}
 */
export async function getUserPasswordHash(userId) {
	const query = getQueryUserPasswordHash(gql, userId);
	const data = await directus.request(query);
	const row = Array.isArray(data.user) ? data.user[0] : data.user?.[0] ?? null;
	return row?.password ?? null;
}

/**
 * Get a user by their email address.
 *
 * @param {string} email
 * @returns {Promise<User | null>}
 */
export async function getUserByEmail(email) {
	const query = getQueryUserFromEmail(gql);
	const data = await directus.request(query, { email });
	const row = Array.isArray(data.user) ? data.user[0] : data.user?.[0] ?? null;
	if (!row) return null;
	return {
		id: row.id,
		email: row.email,
		username: row.username,
		isEmailVerified: row.is_email_verified ?? false
	};
}

/**
 * Mark the given user as having a verified email.
 *
 * @param {string} userId
 * @returns {Promise<User | null>}
 */
export async function markUserEmailVerified(userId) {
	const mutation = getMutationSetUserEmailAsVerified(gql, userId);
	const data = await directus.request(mutation);
	return data.updateUser ?? null;
}

/**
 * Check if an email address is still available.
 *
 * @param {string} email
 * @returns {Promise<boolean>}
 */
export async function checkEmailAvailability(email) {
	const query = getQueryCheckEmail(gql);
	const data = await directus.request(query, { email });
	const users = data.toolgankelijk_user ?? [];
	return users.length === 0;
}

/**
 * Get the list of valid email domains.
 *
 * @returns {Promise<{ domain: string }[]>}
 */
export async function getValidEmailDomains() {
	const query = getQueryValidEmailDomains(gql);
	const data = await directus.request(query);
	return data.toolgankelijk_email_domain ?? [];
}

/**
 * Get an email verification request by id.
 *
 * @param {string} id
 * @returns {Promise<EmailVerificationRequest | null>}
 */
export async function getEmailVerificationRequestById(id) {
	const query = getQueryEmailVerificationById(gql, id);
	const data = await directus.request(query);
	const row = data.emailVerificationCode ?? null;
	if (!row) return null;
	return {
		id: row.id,
		userId: row.user.id,
		email: row.user.email,
		code: row.code,
		expiresAt: new Date(row.expiresAt)
	};
}

/**
 * Create a new email verification request record.
 *
 * @param {{ code: string; expiresAt: Date; userId: string }} input
 * @returns {Promise<EmailVerificationRequest | null>}
 */
export async function createEmailVerificationRequestRecord({ code, expiresAt, userId }) {
	const mutation = getMutationCreateEmailVerification(gql);
	const variables = {
		code,
		expiresAt: expiresAt.toISOString(),
		userId
	};
	const data = await directus.request(mutation, variables);
	const row = data.createEmailVerificationCode ?? null;
	if (!row) return null;
	return {
		id: row.id,
		userId: row.user.id,
		email: row.user.email,
		code: row.code,
		expiresAt: new Date(row.expiresAt)
	};
}

/**
 * Delete all email verification requests for the given user.
 *
 * @param {string} userId
 * @returns {Promise<{ ids: string[] } | null>}
 */
export async function deleteEmailVerificationsForUser(userId) {
	const mutation = getMutationDeleteEmailVerificationsForUser(gql);
	const data = await directus.request(mutation, { userId });
	return data.deleteEmailVerificationCodes ?? null;
}

