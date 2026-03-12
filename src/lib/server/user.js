import { directus } from '$lib/utils/directus.js';
import { gql } from 'graphql-request';
import {
	getQueryCheckUsernameAvailability,
	getMutationCreateUser,
	getQueryUserPasswordHash,
	getQueryUserFromEmail,
	getMutationSetUserEmailAsVerified
} from '$lib/queries/user.js';

export function verifyUsernameInput(username) {
	return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function checkUsernameAvailability(username) {
	const query = getQueryCheckUsernameAvailability(gql);
	const data = await directus.request(query, { username });
	return !(data.users && data.users.length);
}

export async function createUser(email, username, passwordHash) {
	const mutation = getMutationCreateUser(gql);
	const variables = { email, username, password: passwordHash, isEmailVerified: false };
	const data = await directus.request(mutation, variables);
	if (!data.createUser) {
		throw new Error('Unexpected error');
	}
	const user = {
		id: data.createUser.id,
		username: data.createUser.username,
		email: data.createUser.email
	};
	return user;
}

export async function getUserPasswordHash(userId) {
	const query = getQueryUserPasswordHash(gql, userId);
	const data = await directus.request(query);
	if (!data.user || !data.user.length || !data.user[0].password) {
		throw new Error('Invalid user ID');
	}

	return data.user[0].password;
}

export async function getUserFromEmail(email) {
	const query = getQueryUserFromEmail(gql);
	const data = await directus.request(query, { email });
	if (!data.user || !data.user.length) {
		return null;
	}
	const user = {
		id: data.user[0].id,
		email: data.user[0].email,
		username: data.user[0].username
	};

	return user;
}

export async function setUserEmailAsVerified(userId, email) {
	const mutation = getMutationSetUserEmailAsVerified(gql, userId);
	await directus.request(mutation);
}
