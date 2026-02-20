//@ts-check
import * as crypto from 'crypto';
import { hygraph } from '$lib/utils/hygraph.js';
import { gql } from 'graphql-request';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import getQuerySession from '$lib/queries/session';
import getQueryDeleteSession from '$lib/queries/deleteSession';
import getQueryUpdateSession from '$lib/queries/updateSession';
import getQueryAddSession from '$lib/queries/addSession';

// Type definitions
/**
 * @typedef {Object} Session
 * @property {string|null} id
 * @property {string|null} gebruikerId
 * @property {Date} houdbaarTot
 */
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} gebruikersnaam
 * @property {boolean} isEmailGeverifieerd
 */

// Code
/**
 * Validates a Session token
 * @author Maksim Hofker
 * @author Bjarne Zeeman
 * @async
 * @param {String} token The session token to be validated
 * @returns {Promise<{ session: Session | null , user: User  | null }>}
 */
export async function validateSessionToken(token) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const { sessie: row } = await hygraph.request(getQuerySession(gql), { sessionId });

	if (!row) {
		return { session: null, user: null };
	}

	/**
	 * @type {null | Session}
	 */
	let session = {
		id: row.sessieId,
		gebruikerId: row.gebruikerId.id,
		houdbaarTot: new Date(row.houdbaarTot)
	};

	/**
	 * @type {null | User}
	 */
	let user = null;
	if (row.gebruikerId) {
		user = {
			id: row.gebruikerId.id,
			email: row.gebruikerId.email,
			gebruikersnaam: row.gebruikerId.gebruikersnaam,
			isEmailGeverifieerd: row.gebruikerId.isEmailGeverifieerd
		};
	}

	//Invalidate session if outdated Else Refresh session if old
	if (Date.now() >= session.houdbaarTot.getTime()) {
		({ session, user } = await invalidateSession(session));
	} else if (Date.now() >= session.houdbaarTot.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session = await refreshSession(session);
	}
	return { session, user };
}

/**
 * Deletes the given session from Hygraph.
 *
 * Note:
 * This function does NOT clear the session cookie.
 *
 * @async
 * @author Maksim Hofker
 * @author Bjarne Zeeman
 * @param {Session} session - The session to delete.
 * @returns {Promise<{ session: null, user: null }>} An object with nulled session and user values.
 */
async function invalidateSession(session) {
	// Delete session mutation
	await hygraph.request(getQueryDeleteSession(gql), { sessionId: session.id });
	return { session: null, user: null };
}

/**
 * Refreshes a session
 *
 * @async
 * @author Maksim Hofker
 * @author Bjarne Zeeman
 * @param { Session } session - The session object to be refreshed
 * @returns {Promise<Session>} A session with a refreshed lifetime
 */
async function refreshSession(session) {
	session.houdbaarTot = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
	// Update session mutation
	await hygraph.request(getQueryUpdateSession(gql), {
		sessionId: session.id,
		expiresAt: session.houdbaarTot
	});
	return session;
}

/**
 * Sets a session token cookie on the given event.
 *
 * @author Bjarne Zeeman
 * @param {import('@sveltejs/kit').RequestEvent} event - The request event containing cookies.
 * @param {string} token - The session token to store in the cookie.
 * @param {Date} houdbaarTot - The expiration date of the cookie.
 */
export function setSessionTokenCookie(event, token, houdbaarTot) {
	event.cookies.set('session', token, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: houdbaarTot
	});
}

/**
 * Deletes a session token cookie on the given event.
 *
 * @author Maksim Hofker
 * @author Bjarne Zeeman
 * @param {import('@sveltejs/kit').RequestEvent} event - The request event containing cookies.
 */
export function deleteSessionTokenCookie(event) {
	event.cookies.delete('session', { path: '/' });
}

/**
 * Generates a session token
 *
 * @author Bjarne Zeeman
 * @returns {String} session token
 */
export function generateSessionToken() {
	const tokenBytes = crypto.randomBytes(20);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
	return token;
}

/**
 * Creates a new Session
 *
 * @author Bjarne Zeeman
 * @async
 * @param {String} token
 * @param {string} gebruikerId
 * @returns {Promise<Session>}
 */
export async function createSession(token, gebruikerId) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session = {
		id: sessionId,
		gebruikerId,
		houdbaarTot: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	await hygraph.request(getQueryAddSession(gql), {
		userId: session.gebruikerId,
		expiresAt: session.houdbaarTot.toISOString(),
		sessionId: session.id
	});
	return session;
}
