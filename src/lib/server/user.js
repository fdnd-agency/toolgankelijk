import {
	checkUsernameAvailability,
	createUser,
	getUserPasswordHash,
	getUserByEmail,
	markUserEmailVerified
} from '$lib/repositories/userRepository.js';

export function verifyUsernameInput(username) {
	return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function checkUsernameAvailability(username) {
	return await checkUsernameAvailability(username);
}

export async function createUser(email, username, passwordHash) {
	const created = await createUser({
		email,
		username,
		passwordHash,
		isEmailVerified: false
	});
	if (!created) {
		throw new Error('Unexpected error');
	}
	return created;
}

export async function getUserPasswordHash(userId) {
	const hash = await getUserPasswordHash(userId);
	if (!hash) {
		throw new Error('Invalid user ID');
	}
	return hash;
}

export async function getUserFromEmail(email) {
	return await getUserByEmail(email);
}

export async function setUserEmailAsVerified(userId, email) {
	await markUserEmailVerified(userId);
}
